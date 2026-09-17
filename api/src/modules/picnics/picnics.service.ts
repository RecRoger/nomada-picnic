import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BUSINESS_NUMBER, PAYMENT_METHODS_MAP } from '@shared/const';
import { BookingStatus, PaymentMethods, PaymentTypes } from '@shared/enums';
import { IBookingConfirmationEmail, ICost, IPaginatedPicnics, IPicnicEvent, IPicnicPackage, IPlace } from '@shared/interfaces';
import { IPicnicDetail } from '@shared/interfaces/picnic-detail.interface';
import MercadoPagoConfig, { Payment, Preference } from 'mercadopago';
import { Model, Types } from 'mongoose';
import { PicnicPackage, PicnicPackageDocument } from 'src/common/database/schemas/picnic-packages.schema';
import { Picnic, PicnicsDocument } from 'src/common/database/schemas/picnics.schema';
import { Place, PlacesDocument } from 'src/common/database/schemas/places.schema';
import { CreatePicnicDto, UpdatePicnicDto } from 'src/common/models/create-picnic.dto';
import { QueryPicnicDto } from 'src/common/models/query-picnic.dto';
import { GoogleCalendarService } from 'src/modules/calendar/google-calendar.service';
import { MailService } from 'src/modules/mails/mail.service';

@Injectable()
export class PicnicsService {
  private readonly logger = new Logger(PicnicsService.name)
  private mpClient: MercadoPagoConfig;
  private DOLAR_EXCHANGE = 1500

  constructor(
    @InjectModel(Picnic.name) private picnicsModel: Model<PicnicsDocument>,
    @InjectModel(PicnicPackage.name) private packagesModel: Model<PicnicPackageDocument>,
    @InjectModel(Place.name) private placesModel: Model<PlacesDocument>,
    private readonly mailService: MailService,
    private readonly calendarService: GoogleCalendarService,
  ) {
    this.mpClient = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN || '',
    });
  }

  async getBookedDatesNextYear(): Promise<{ date: string; time: string, maxGuest: number }[]> {
    this.logger.log('[getBookedDatesNextYear]')
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);

    const picnics = await this.picnicsModel
      .find({
        eventDate: { $gte: today, $lte: nextYear },
        status: {
          $in: [BookingStatus.PENDING, BookingStatus.PAID, BookingStatus.PARTIALLY_PAID],
        },
      })
      .select('eventDate eventTime maxGuest')
      .exec();

    return picnics.map((picnic) => ({
      date: new Date(picnic.eventDate).toString(),
      time: picnic.eventTime,
      maxGuest: picnic.maxGuest
    }));
  }

  async findAllPicnics(queryDto: QueryPicnicDto): Promise<IPaginatedPicnics> {
    this.logger.log('[findAllPicnics]')
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = queryDto;
    const skip = (page - 1) * limit;
    const order = sortOrder.toLowerCase() === 'asc' ? 1 : -1;

    const [picnics, totalItems] = await Promise.all([
      this.picnicsModel
        .find()
        .populate<{ package: IPicnicPackage }>('package', 'name description includedItems')
        .populate<{ event: IPicnicEvent }>('event', 'name')
        .populate<{ place: IPlace }>('place', 'name address location mapsLink')
        .populate<{ 'additionals.cost': ICost }>({
          path: 'additionals.cost',
          select: 'name type guestsCoverage',
        })
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.picnicsModel.countDocuments().exec(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      picnics: picnics as unknown as IPicnicDetail[],
      meta: {
        totalItems,
        itemCount: picnics.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  async getPicnicDetails(picnicId: string, name?: string, lastname?: string): Promise<IPicnicDetail> {
    this.logger.log('[getPicnicDetails]', picnicId)

    if (!Types.ObjectId.isValid(picnicId)) {
      throw new NotFoundException(`ID no válido: ${picnicId}`);
    }

    const picnic = await this.picnicsModel
      .findById(picnicId)
      .populate<{ package: IPicnicPackage }>('package', 'name description includedItems')
      .populate<{ event: IPicnicEvent }>('event', 'name')
      .populate<{ place: IPlace }>('place', 'name address location mapsLink')
      .populate<{ 'additionals.cost': ICost }>({
        path: 'additionals.cost',
        select: 'name type guestsCoverage',
      })
      .exec();

    if (!picnic) {
      throw new NotFoundException(`Picnic con ID ${picnicId} no encontrado`);
    }

    if (name && lastname) {
      const normalizeString = (value: unknown): string => {
        if (value === null || value === undefined) return '';
        return String(value)
          .trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Elimina acentos (ej: "Gómez" -> "gomez")
          .replace(/\s+/g, '')             // Elimina espacios
          .toLowerCase();
      }

      const parseName = normalizeString(name)
      const parseLastname = normalizeString(lastname)
      const parsePicnicName = normalizeString(picnic.clientInfo.name)
      const parsePicnicLastname = normalizeString(picnic.clientInfo.lastname)

      if (!parsePicnicName.includes(parseName) || !parsePicnicLastname.includes(parseLastname)) {
        throw new NotFoundException(`Apellido y nombre no cohinciden con dueño de la reserva`);
      }
    }

    return picnic as unknown as IPicnicDetail;
  }

  async updatePicnic(id: string, updatePicnicDto: UpdatePicnicDto): Promise<IPicnicDetail> {
    this.logger.log('[updatePicnic]', id)
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`ID no válido: ${id}`);
    }

    const currentPicnic = await this.picnicsModel.findById(id).select('status totalAmount').exec();

    if (!currentPicnic) {
      throw new NotFoundException(`Picnic con ID ${id} no encontrado`);
    }
    const previousStatus = currentPicnic.status;

    const updates = {
      eventDate: updatePicnicDto.eventDate,
      eventTime: updatePicnicDto.eventTime,
      depositAmount: updatePicnicDto.depositAmount,
      paidAmount: updatePicnicDto.paidAmount,
      pendingAmount: Number(currentPicnic.totalAmount) - Number(updatePicnicDto.paidAmount),
      paymentOption: updatePicnicDto.paymentOption,
      paymentMethod: updatePicnicDto.paymentMethod,
      status: updatePicnicDto.status,
      'clientInfo.boardMessage': updatePicnicDto.clientInfo.boardMessage,
      'clientInfo.honoredName': updatePicnicDto.clientInfo.honoredName,
      'clientInfo.comments': updatePicnicDto.clientInfo.comments,
    }


    const updatedPicnic = await this.picnicsModel
      .findByIdAndUpdate(id, { $set: updates }, { new: true })
      .populate<{ package: IPicnicPackage }>('package', 'name description includedItems')
      .populate<{ event: IPicnicEvent }>('event', 'name')
      .populate<{ place: IPlace }>('place', 'name address location mapsLink')
      .populate<{ 'additionals.cost': ICost }>({
        path: 'additionals.cost',
        select: 'name type guestsCoverage',
      })
      .exec();

    if (!updatedPicnic) {
      throw new NotFoundException(`Picnic con ID ${id} no encontrado para actualizar`);
    }

    if (previousStatus == BookingStatus.PENDING && [BookingStatus.PAID, BookingStatus.PARTIALLY_PAID].includes(updatePicnicDto.status) && previousStatus !== updatePicnicDto.status) {
      await this.getExchange()
      await this.startConfirmationProcess(id);
    }

    return updatedPicnic as unknown as IPicnicDetail;
  }

  async removePicnic(id: string): Promise<{ message: string; id: string }> {
    this.logger.log('[removePicnic]', id)
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`ID no válido: ${id}`);
    }

    const deletedPicnic = await this.picnicsModel.findByIdAndDelete(id).exec();

    if (!deletedPicnic) {
      throw new NotFoundException(`Picnic con ID ${id} no encontrado para eliminar`);
    }

    return {
      message: 'Picnic eliminado exitosamente',
      id,
    };
  }

  async createPicnic(dto: CreatePicnicDto, paymentOption: PaymentTypes = PaymentTypes.FULL, paymentMethods: PaymentMethods = PaymentMethods.OTHER): Promise<string> {
    this.logger.log('[createPicnic]', dto.clientInfo.name)

    try {
      const additionalsTotal = dto.additionals.reduce((sum, item) => sum + item.totalPrice, 0);
      const totalAmount = dto.booking.basePrice + additionalsTotal;

      const isDeposit = paymentOption === PaymentTypes.DEPOSIT;
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
        paymentOption: paymentOption,
        paymentMethod: paymentMethods,
        paidAmount: 0,
        pendingAmount: totalAmount,
      });

      const savedPicnic = await newPicnic.save();
      this.logger.log('[createPicnic] Picnic guardado en BD (PENDING)')

      const pkg = await this.packagesModel.findById(dto.booking.packageId).lean().exec()
      const place = await this.placesModel.findById(dto.booking.placeId).lean().exec()
      if (paymentMethods == PaymentMethods.MP) {
        const payLink = await this.generatePayment(
          savedPicnic,
          initialChargeAmount,
          isDeposit ? `Seña (50%) - ${pkg.name}` : `Pago Total - ${pkg.name}`,
          `picnicId=${savedPicnic._id}&placeName=${place.name.replaceAll(' ', '_')}&packageName=${pkg.name.replaceAll(' ', '_')}&eventDate=${dto.booking.eventDate
            .toString()}&eventTime=${dto.booking.eventTime}&clientName=${dto.clientInfo.name.replaceAll(' ', '_') + '_' + dto.clientInfo.lastname.replaceAll(' ', '_')}`
        )
        return payLink
      } else {
        return await this.createWhPaymentNotification(savedPicnic, place, pkg, paymentOption, paymentMethods)
      }

    } catch (err) {
      this.logger.error(`Error booking picnic: ${err.message}`, err.stack, PicnicsService.name);
      throw new Error('Error al guardar la reserva del picnic');
    }
  }

  private async getExchange(): Promise<number> {
    this.logger.log('[getExchange] init')
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

    this.DOLAR_EXCHANGE = data.venta;
    this.logger.log('[generatePayment] tasa de cambio $' + this.DOLAR_EXCHANGE)
    return this.DOLAR_EXCHANGE
  }

  private async createWhPaymentNotification(savedPicnic: PicnicsDocument, place: PlacesDocument, pkg: PicnicPackageDocument, paymentOption: PaymentTypes, paymentMethod: PaymentMethods): Promise<string> {
    this.logger.log('[createWhPaymentNotification]')
    const clientInfo = savedPicnic.clientInfo
    const exchange = await this.getExchange()
    const eventDateFormatted = new Date(savedPicnic.eventDate).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    let message = `¡Hola! Mi mi nombre es ${clientInfo.name} y me gustaria coordinar el pago de mi ${pkg.name}: \n - PicnicId: ${savedPicnic._id} \n - Nº de invitados: ${savedPicnic.maxGuest} personas \n - Lugar: ${place!.name} \n - Fecha y hora: ${eventDateFormatted} a las ${savedPicnic.eventTime} \n - Precio del picnic: US$ ${(savedPicnic!.basePrice).toLocaleString('es-AR')}`;
    if (savedPicnic.additionals.length) {
      const additionalsPrice = savedPicnic.additionals.reduce((acc, cost) => acc + cost.totalPrice, 0)
      let additionalsText = `\n - Precio de adicionales: US$ ${additionalsPrice.toLocaleString('es-AR')}`
      message = message + additionalsText
    }

    message = message + `\n - *Precio Total: US$ ${(savedPicnic.totalAmount).toLocaleString('es-AR')}* \n - Forma de pago: ${PAYMENT_METHODS_MAP[paymentMethod] || paymentMethod}`
    if (paymentOption == PaymentTypes.DEPOSIT) {
      const price = savedPicnic.totalAmount / 2
      message = message + `\n - Valor de la seña: US$ ${price.toLocaleString('es-AR')} \n - Tasa de cambio: $ ${exchange.toLocaleString('es-AR')} x 1 US$ \n - Precio al cambio: $ ${(price * exchange).toLocaleString('es-AR')}`
    } else {
      message = message + `\n - Tasa de cambio: $ ${exchange.toLocaleString('es-AR')} x 1 US$ \n - Precio al cambio: $ ${(savedPicnic.totalAmount * exchange).toLocaleString('es-AR')}`
    }
    message = message + '\n Quedo a la espera de metodos de pago y formas de proceder con la reserva (: .'
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${BUSINESS_NUMBER}?text=${encodedMessage}`;
  }

  private async generatePayment(savedPicnic: PicnicsDocument, amount: number, paymentTitle: string, sucessParams: string): Promise<string> {
    this.logger.log('[generatePayment]', savedPicnic._id)
    try {
      const preference = new Preference(this.mpClient);
      const clientInfo = savedPicnic.clientInfo

      const exchange = await this.getExchange()
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
          this.logger.log('[processPaymentWebhook] picnic cancelado', paymentId);
        }
      }
    } catch (error) {
      this.logger.error(`Error al procesar el pago ${paymentId}: ${error.message}`, error.stack);
    }
  }

  private async startConfirmationProcess(picnicId: string): Promise<void> {
    this.logger.log('[startConfirmationProcess]', picnicId);
    const picnic: IPicnicDetail = await this.getPicnicDetails(picnicId)
    await this.sendConfirmationMail(picnic)
    await this.createClientCalendarEvent(picnic)
    await this.createProductionCalendarEvent(picnic)
  }

  private async sendConfirmationMail(picnicData: IPicnicDetail): Promise<void> {
    this.logger.log('[startConfirmationProcess]', picnicData._id!);
    const eventDateFormatted = new Date(picnicData.eventDate).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const isDeposit = picnicData.paymentOption === 'DEPOSIT';

    const emailData: IBookingConfirmationEmail = {
      clientName: picnicData.clientInfo.name,
      bookingNumber: picnicData._id!,
      experienceName: picnicData.package.name,
      guestsCount: `${picnicData.minGuest}${picnicData.minGuest != picnicData.maxGuest ? (' - ' + picnicData.maxGuest) : ''}`,
      eventDateFormatted,
      eventTime: picnicData.eventTime,
      locationName: picnicData.place?.name || 'Lugar a convenir',
      celebrationType: picnicData.event?.name || 'Evento Especial',
      // Financiero
      isDeposit,
      subtotalFormatted: picnicData.totalAmount.toLocaleString('es-AR'),
      paidAmountFormatted: picnicData.paidAmount.toLocaleString('es-AR'),
      pendingAmountFormatted: picnicData.pendingAmount.toLocaleString('es-AR'),
      // Lista de Adicionales
      additionals: picnicData.additionals.map((item: any) => ({
        name: item.cost?.name || 'Adicional',
        priceFormatted: item.totalPrice.toLocaleString('es-AR'),
      })),
      // Logística / Instrucciones
      durationHours: 3,
      manageBookingUrl: `${process.env.FRONTEND_URL}/bookings?id=${picnicData._id}`,
      whatsappUrl: `https://wa.me/5491112345678?text=Hola!%20Tengo%20una%20consulta%20sobre%20mi%20reserva%20${picnicData._id}`,
      faqUrl: `${process.env.FRONTEND_URL}/contact`,
      cancellationPolicyUrl: `${process.env.FRONTEND_URL}/policy`,
    }
    await this.mailService.sendBookingConfirmation(emailData, picnicData.clientInfo.email)
    this.logger.log('[startConfirmationProcess] mensaje enviado');
    return
  }

  private async createClientCalendarEvent(picnicData: IPicnicDetail): Promise<void> {
    this.logger.log('[createClientCalendarEvent]', picnicData._id!);
    const [hours, minutes] = picnicData.eventTime.split(':').map(Number);
    const startDateTime = new Date(picnicData.eventDate);
    startDateTime.setHours(hours || 13, minutes || 0, 0, 0);

    const description = this.calendarService.createEventDescription(picnicData, this.DOLAR_EXCHANGE)

    await this.calendarService.createPicnicEvent({
      summary: `🧺 Picnic Nómada - Picnic de ${picnicData.event.name}`,
      clientEmail: picnicData.clientInfo.email,
      clientName: `${picnicData.clientInfo.name} ${picnicData.clientInfo.lastname}`,
      startDateTime,
      durationHours: 3,
      latitude: picnicData.place?.location.lat,
      longitude: picnicData.place?.location.lng,
      locationName: picnicData.place?.name,
      description,
    });
  }

  private async createProductionCalendarEvent(picnicData: IPicnicDetail): Promise<void> {
    this.logger.log('[createProductionCalendarEvent]', picnicData._id!);
    const [hours, minutes] = picnicData.eventTime.split(':').map(Number);
    const startDateTime = new Date(picnicData.eventDate);
    startDateTime.setHours((hours - 1) || 11, minutes || 0, 0, 0);

    const description = this.calendarService.createEventDescription(picnicData, this.DOLAR_EXCHANGE, true)

    await this.calendarService.createProductionEvent({
      summary: `[PRODUCCION] - Picnic de ${picnicData.event.name} ${picnicData._id}`,
      clientEmail: picnicData.clientInfo.email,
      clientName: `${picnicData.clientInfo.name} ${picnicData.clientInfo.lastname}`,
      startDateTime,
      durationHours: 3,
      latitude: picnicData.place?.location.lat,
      longitude: picnicData.place?.location.lng,
      locationName: picnicData.place?.name,
      description,
    });
  }
}
