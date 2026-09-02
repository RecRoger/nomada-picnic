import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BookingStatus } from '@shared/enums';
import { IBookingClientInfo, IBookingConfirmationEmail } from '@shared/interfaces';
import MercadoPagoConfig, { Payment, Preference } from 'mercadopago';
import { Model } from 'mongoose';
import { PicnicPackage, PicnicPackageDocument } from 'src/common/database/schemas/picnic-packages.schema';
import { Picnic, PicnicsDocument } from 'src/common/database/schemas/picnics.schema';
import { Place, PlacesDocument } from 'src/common/database/schemas/places.schema';
import { CreatePicnicDto } from 'src/common/models/create-picnic.dto';
import { MailService } from 'src/modules/mails/mail.service';

@Injectable()
export class PicnicsService {
  private readonly logger = new Logger(PicnicsService.name)
  private mpClient: MercadoPagoConfig;

  constructor(
    @InjectModel(Picnic.name) private picnicsModel: Model<PicnicsDocument>,
    @InjectModel(PicnicPackage.name) private packagesModel: Model<PicnicPackageDocument>,
    @InjectModel(Place.name) private placesModel: Model<PlacesDocument>,
    private readonly mailService: MailService,
  ) {
    this.mpClient = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN || '',
    });
  }

  async createPicnic(dto: CreatePicnicDto, paymentOption: 'full' | 'deposit' = 'full'): Promise<string> {
    this.logger.log('[createPicnic]', dto.clientInfo.name)

    try {
      const additionalsTotal = dto.additionals.reduce((sum, item) => sum + item.totalPrice, 0);
      const totalAmount = dto.booking.basePrice + additionalsTotal;

      const isDeposit = paymentOption === 'deposit';
      const depositAmount = totalAmount * 0.5;
      const initialChargeAmount = isDeposit ? depositAmount : totalAmount;

      const newPicnic = new this.picnicsModel({
        package: dto.booking.packageId,
        event: dto.booking.eventId,
        place: dto.booking.placeId,
        minGuest: dto.booking.minGuest,
        maxGuest: dto.booking.maxGuest,
        eventDate: new Date(dto.booking.eventDate),
        eventTime: dto.booking.eventTime,
        basePrice: dto.booking.basePrice,
        additionals: dto.additionals.map((add) => ({
          cost: add.costId,
          unitPrice: add.unitPrice,
          quantity: add.quantity,
          totalPrice: add.totalPrice,
        })),
        clientInfo: dto.clientInfo,
        status: BookingStatus.PENDING,
        totalAmount,
        depositAmount: depositAmount,
        paymentOption: isDeposit ? 'DEPOSIT' : 'FULL',
        paidAmount: 0,
        pendingAmount: totalAmount,
      });

      const savedPicnic = await newPicnic.save();
      this.logger.log('[createPicnic] Picnic guardado en BD (PENDING)')

      const pkg = await this.packagesModel.findById(dto.booking.packageId).lean().exec()
      const place = await this.placesModel.findById(dto.booking.placeId).lean().exec()
      const payLink = await this.generatePayment(
        savedPicnic,
        initialChargeAmount,
        isDeposit ? `Seña (50%) - ${pkg.name}` : `Pago Total - ${pkg.name}`,
        `picnicId=${savedPicnic._id}&placeName=${place.name.replaceAll(' ', '_')}&packageName=${pkg.name.replaceAll(' ', '_')}&eventDate=${dto.booking.eventDate.toString()}&eventTime=${dto.booking.eventTime}&clientName=${dto.clientInfo.name.replaceAll(' ', '_') + '_' + dto.clientInfo.lastname.replaceAll(' ', '_')}`
      )

      return payLink
    } catch (err) {
      this.logger.error(`Error booking picnic: ${err.message}`, err.stack, PicnicsService.name);
      throw new Error('Error al guardar la reserva del picnic');
    }
  }

  private async generatePayment(savedPicnic: PicnicsDocument, amount: number, paymentTitle: string, sucessParams: string): Promise<string> {
    this.logger.log('[generatePayment]', savedPicnic._id)
    try {
      const preference = new Preference(this.mpClient);
      const clientInfo = savedPicnic.clientInfo

      // TODO -  mejorar integracion de cambio
      const exchangeResp = await fetch('https://dolarapi.com/v1/dolares/oficial');
      if (!exchangeResp.ok) {
        throw new Error(`Error en la API de cotización: ${exchangeResp.statusText}`);
      }
      const data: {
        compra: number;
        venta: number;
        casa: string;
        nombre: string;
        fechaActualizacion: string;
      } = await exchangeResp.json();

      const exchange = data.venta;
      this.logger.log('[generatePayment] tasa de cambio $' + exchange)
      const preferenceBody = {
        items: [
          {
            id: savedPicnic._id.toString(),
            title: paymentTitle,
            quantity: 1,
            unit_price: amount * exchange,
            currency_id: 'ARS',
          },
        ],
        payer: {
          name: clientInfo.name,
          surname: clientInfo.lastname,
          email: clientInfo.email,
          phone: {
            number: clientInfo.phone,
          },
        },
        payment_methods: {
          excluded_payment_types: [
            {
              id: 'ticket',
            },
          ],
          installments: 6,
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL}/checkout/confirmation?${sucessParams}`,
          failure: `${process.env.FRONTEND_URL}/checkout/payment?error=true&picnicId=${savedPicnic._id}`,
          pending: `${process.env.FRONTEND_URL}/checkout/payment?picnicId=${savedPicnic._id}`,
        },
        auto_return: 'approved',
        external_reference: savedPicnic._id.toString(),
        notification_url: `${process.env.BACKEND_URL}/api/picnics/webhook`,
      }
      const response = await preference.create({
        body: preferenceBody,
      });

      savedPicnic.preferenceId = response.id;
      this.logger.log(`[generatePayment] preference=${response.id}`);
      this.logger.log(`[generatePayment] init_point=${response.init_point}`);
      await savedPicnic.save();
      this.logger.log('[generatePayment] picnic')

      return response.init_point
    } catch (error) {
      console.error('Error al generar preferencia en Mercado Pago:', error);
      throw new InternalServerErrorException('Error al procesar la pasarela de pago');
    }
  }

  async processPaymentWebhook(paymentId: string): Promise<void> {
    this.logger.log('[processPaymentWebhook]', paymentId);

    try {
      const payment = new Payment(this.mpClient);
      const paymentData = await payment.get({ id: paymentId });

      if (!paymentData || !paymentData.external_reference) return;

      const picnicId = paymentData.external_reference;
      const picnic = await this.picnicsModel.findById(picnicId);

      if (!picnic) {
        this.logger.warn(`[processPaymentWebhook] Picnic no encontrado: ${picnicId}`);
        return;
      }

      if (paymentData.status === 'approved') {
        const isDeposit = picnic.paymentOption === 'DEPOSIT';
        const transactionAmount = isDeposit ? picnic.depositAmount : picnic.totalAmount;

        const newPaidAmount = (picnic.paidAmount || 0) + transactionAmount;
        const newPendingAmount = Math.max(0, picnic.totalAmount - newPaidAmount);

        const isFullyPaid = newPendingAmount === 0;
        const newStatus = isFullyPaid ? BookingStatus.PAID : BookingStatus.PARTIALLY_PAID;

        await this.picnicsModel.findByIdAndUpdate(picnicId, {
          status: newStatus,
          paymentId: paymentId,
          paidAmount: newPaidAmount,
          pendingAmount: newPendingAmount,
        });

        this.logger.log(
          `[processPaymentWebhook] Picnic ${picnicId} actualizado. Pagado: ${newPaidAmount}, Pendiente: ${newPendingAmount}, Estado: ${newStatus}`
        );
        await this.startConfirmationProcess(picnicId)

      } else if (paymentData.status === 'cancelled' || paymentData.status === 'rejected') {
        if (picnic.paidAmount === 0) {
          await this.picnicsModel.findByIdAndUpdate(picnicId, {
            status: BookingStatus.CANCELLED,
            paymentId: paymentId,
          });
        }
      }
    } catch (error) {
      this.logger.error(`Error al procesar el pago ${paymentId}: ${error.message}`, error.stack);
    }
  }

  private async startConfirmationProcess(picnicId: string): Promise<void> {
    const picnic: any = await this.picnicsModel
      .findById(picnicId)
      .populate('package')
      .populate('event')
      .populate('place')
      .populate({
        path: 'additionals.cost', // Popula la referencia cargada en cost (add.costId)
      })
      .exec();

    const eventDateFormatted = new Date(picnic.eventDate).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const isDeposit = picnic.paymentOption === 'DEPOSIT';

    const emailData: IBookingConfirmationEmail = {
      clientName: picnic.clientInfo.name,
      bookingNumber: picnicId,
      experienceName: picnic.package.name,
      guestsCount: `${picnic.minGuest}${picnic.minGuest != picnic.maxGuest ? (' - ' + picnic.maxGuest) : ''}`,
      eventDateFormatted,
      eventTime: picnic.eventTime,
      locationName: picnic.place?.name || 'Lugar a convenir',
      celebrationType: picnic.event?.name || 'Evento Especial',
      // Financiero
      isDeposit,
      subtotalFormatted: picnic.totalAmount.toLocaleString('es-AR'),
      paidAmountFormatted: picnic.paidAmount.toLocaleString('es-AR'),
      pendingAmountFormatted: picnic.pendingAmount.toLocaleString('es-AR'),
      // Lista de Adicionales
      additionals: picnic.additionals.map((item: any) => ({
        name: item.cost?.name || 'Adicional',
        priceFormatted: item.totalPrice.toLocaleString('es-AR'),
      })),

      // Logística / Instrucciones
      durationHours: 3,
      manageBookingUrl: `${process.env.FRONTEND_URL}/booking?id=${picnic._id}`,
      whatsappUrl: `https://wa.me/5491112345678?text=Hola!%20Tengo%20una%20consulta%20sobre%20mi%20reserva%20${picnic._id}`,
      faqUrl: `${process.env.FRONTEND_URL}/contact`,
      cancellationPolicyUrl: `${process.env.FRONTEND_URL}/policy`,
    }
    await this.mailService.sendBookingConfirmation(emailData, picnic.clientInfo.email)
  }
}
