import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BookingStatus } from '@shared/enums';
import { IBookingClientInfo } from '@shared/interfaces';
import MercadoPagoConfig, { Payment, Preference } from 'mercadopago';
import { Model } from 'mongoose';
import { Picnic, PicnicsDocument } from 'src/common/database/schemas/picnics.schema';
import { CreatePicnicDto } from 'src/common/models/create-picnic.dto';

@Injectable()
export class PicnicsService {
  private readonly logger = new Logger(PicnicsService.name)
  private mpClient: MercadoPagoConfig;

  constructor(@InjectModel(Picnic.name) private picnicsModel: Model<PicnicsDocument>) {
    this.mpClient = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN || '',
    });
  }

  async createPicnic(dto: CreatePicnicDto): Promise<string> {
    this.logger.log('[createPicnic]', dto.clientInfo.name)

    try {
      const additionalsTotal = dto.additionals.reduce((sum, item) => sum + item.totalPrice, 0);
      const totalAmount = dto.booking.basePrice + additionalsTotal;

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
        totalAmount,
        status: BookingStatus.PENDING,
      });

      const savedPicnic = await newPicnic.save();
      this.logger.log('[createPicnic] Picnic guardado en BD (PENDING)')

      const payLink = await this.generatePayment(savedPicnic, totalAmount)

      return payLink
    } catch (err) {
      this.logger.error(`Error booking picnic: ${err.message}`, err.stack, PicnicsService.name);
      throw new Error('Error al guardar la reserva del picnic');
    }
  }

  private async generatePayment(savedPicnic: PicnicsDocument, amount: number): Promise<string> {
    this.logger.log('[generatePayment]', savedPicnic._id)
    try {
      const preference = new Preference(this.mpClient);

      const clientInfo = savedPicnic.clientInfo
      const preferenceBody = {
        items: [
          {
            id: savedPicnic._id.toString(),
            title: 'Reserva Nómada Picnic',
            quantity: 1,
            unit_price: amount,
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
          success: `${process.env.FRONTEND_URL}/checkout/confirmation?picnicId=${savedPicnic._id}`,
          failure: `${process.env.FRONTEND_URL}/checkout/payment?error=true&picnicId=${savedPicnic._id}`,
          pending: `${process.env.FRONTEND_URL}/checkout/payment?picnicId=${savedPicnic._id}`,
        },
        auto_return: 'approved',
        external_reference: savedPicnic._id.toString(),
        notification_url: `${process.env.BACKEND_URL}/api/picnics/webhook`,
      }
      this.logger.debug(
        `[generatePayment] Preference body: ${JSON.stringify(preferenceBody, null, 2)}`,
      );
      const response = await preference.create({
        body: preferenceBody,
      });

      // 4. Guardar preferenceId en la reserva y retornar init_point
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

    this.logger.log('[processPaymentWebhook]', paymentId)

    try {
      let payment = new Payment(this.mpClient);
      let paymentData = await payment.get({ id: paymentId });

      if (!paymentData || !paymentData.external_reference) return


      const picnicId = paymentData?.external_reference;

      if (paymentData.status === 'approved') {
        await this.picnicsModel.findByIdAndUpdate(picnicId, {
          status: BookingStatus.PAID,
          paymentId: paymentId,
        });

        // TODO - Disparar el envío de email de confirmación (Resend)

      } else if (paymentData?.status === 'cancelled' || paymentData?.status === 'rejected') {
        await this.picnicsModel.findByIdAndUpdate(picnicId, {
          status: BookingStatus.CANCELLED,
          paymentId: paymentId,
        });
      }
    } catch (error) {
      console.error(`Error al procesar el pago ${paymentId}:`, error);
    }
  }
}
