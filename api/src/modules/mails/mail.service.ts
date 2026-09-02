import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { AgencyContactDto } from 'src/common/models/agency-contact.dto';
import { CLIENT_TYPES_MAP, EVENT_TYPES_MAP, PLACES_OPTIONS_MAP, SERVICES_MAP } from '@shared/const';
import { IBookingConfirmationEmail } from '@shared/interfaces';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) { }

  async sendAgencyContactService(dto: AgencyContactDto): Promise<boolean> {
    this.logger.log('[sendAgencyContactService] - from ' + dto.company)

    const formattedData = {
      ...dto,
      clientType: CLIENT_TYPES_MAP[dto.clientType] || dto.clientType,
      eventType: EVENT_TYPES_MAP[dto.eventType] || dto.eventType,
      placeChoice: PLACES_OPTIONS_MAP[dto.placeChoice] || dto.placeChoice,
      services: (dto.services || []).map(
        (code) => SERVICES_MAP[code] || code,
      ),
      eventDate: dto.eventDate.toLocaleString()
    };

    try {
      // 1. Envío de notificación interna
      await this.mailerService.sendMail({
        to: 'contacto@nomadapicnic.com',
        subject: `[Agencia] Nueva solicitud: ${dto.company}`,
        template: './agency-contact-internal',
        context: {
          ...formattedData,
        },
      });

      // // 2. Envío de confirmación a la agencia / cliente
      await this.mailerService.sendMail({
        to: dto.email,
        subject: 'Recibimos tu solicitud de propuesta - Nómada Picnic',
        template: './agency-contact-client',
        context: {
          fullName: formattedData.fullName,
          company: formattedData.company,
          eventType: formattedData.eventType,
          guestsRange: formattedData.guestsRange,
          eventDate: formattedData.eventDate,
          placeChoice: formattedData.placeChoice,
          whatsappNumber: '+5491126908781',
          encodedFullName: encodeURIComponent(formattedData.fullName),
          encodedCompany: encodeURIComponent(formattedData.company),
        },
      });
      return true
    } catch (err) {
      this.logger.error(` - Error sending mails: ${err.message}`, err.stack);
      throw new Error('Error al enviar correos');
    }

  }

  async sendBookingConfirmation(emailData: IBookingConfirmationEmail, toEmail: string) {
    this.logger.log('[sendBookingConfirmation] - from ' + emailData.bookingNumber)

    try {
      await this.mailerService.sendMail({
        to: [toEmail],
        subject: `¡Tu reserva ${emailData.bookingNumber} está confirmada! 🧺`,
        template: './booking-confirmation',
        context: emailData,
      });
      return true
    } catch (err) {
      this.logger.error(` - Error sending mails: ${err.message}`, err.stack);
      throw new Error('Error al enviar correos');
    }
  }
}