import { Injectable, Logger } from '@nestjs/common';
import { ICalendarEvent } from '@shared/interfaces';
import { google } from 'googleapis';


@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private calendar;

  constructor() {
    // Configuración con JWT (Service Account)
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar'],
      subject: 'contacto@gmail.com', // Correo corporativo al que pertenece el calendario
    });

    this.calendar = google.calendar({ version: 'v3', auth });
  }

  async createPicnicEvent(data: ICalendarEvent): Promise<string | null> {
    try {
      const endDateTime = new Date(data.startDateTime);
      endDateTime.setHours(endDateTime.getHours() + (data.durationHours || 3));

      const locationString = data.latitude && data.longitude
        ? `${data.locationName || 'Punto de encuentro'} (${data.latitude}, ${data.longitude}) https://maps.google.com/?q=${data.latitude},${data.longitude}`
        : data.locationName || 'Lugar a convenir';

      const event = {
        summary: data.summary,
        location: locationString,
        description: data.description,
        colorId: '10',
        start: {
          dateTime: data.startDateTime.toISOString(),
          timeZone: 'America/Argentina/Buenos_Aires',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'America/Argentina/Buenos_Aires',
        },
        attendees: [
          { email: data.clientEmail, displayName: data.clientName },
          { email: 'contacto@nomadapicnic.com', displayName: 'Nómada Picnic' },
        ],
        guestsCanSeeOtherGuests: true,
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 2 * 24 * 60 }, // Notificación 2 día antes
            { method: 'popup', minutes: 24 * 60 }, // Notificación 1 día antes
            { method: 'popup', minutes: 180 },     // Notificación 3 horas antes
            { method: 'popup', minutes: 120 },     // Notificación 2 horas antes
            { method: 'popup', minutes: 60 },     // Notificación 1 horas antes
          ],
        },
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
        sendUpdates: 'all',
      });

      this.logger.log(`[createPicnicEvent] Evento creado con éxito ID: ${response.data.id}`);
      return response.data.htmlLink || null;
    } catch (error) {
      this.logger.error(`Error al crear evento en Google Calendar: ${error.message}`, error.stack);
      return null;
    }
  }
}