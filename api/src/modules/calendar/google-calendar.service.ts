import { Injectable, Logger } from '@nestjs/common';
import { CHECKLIST_ELEMENTS, DRINKS_MAP, PAYMENT_METHODS_MAP, PICNIC_NAMES, PRODUCTION_EMAIL } from '@shared/const';
import { ICalendarEvent } from '@shared/interfaces';
import { IPicnicDetail } from '@shared/interfaces/picnic-detail.interface';
import { calendar_v3, google } from 'googleapis';

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private calendar: calendar_v3.Calendar;

  constructor() {
    // Configuración con JWT (Service Account)
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: this.cleanPrivateKey(process.env.GOOGLE_PRIVATE_KEY),
      scopes: ['https://www.googleapis.com/auth/calendar'],
      subject: 'contacto@nomadapicnic.com', // Mantener esta línea
    });

    this.calendar = google.calendar({ version: 'v3', auth });
  }

  private cleanPrivateKey(key: string | undefined): string {
    if (!key) return '';
    let cleaned = key.trim().replace(/^["']|["']$/g, '');
    cleaned = cleaned.replace(/\\n/g, '\n');
    cleaned = cleaned.replace(/\r\n/g, '\n');
    if (!cleaned.includes('-----BEGIN PRIVATE KEY-----')) {
      cleaned = `-----BEGIN PRIVATE KEY-----\n${cleaned}\n-----END PRIVATE KEY-----`;
    }
    return cleaned;
  }

  async createPicnicEvent(data: ICalendarEvent, production = false): Promise<string | null> {
    try {
      this.logger.log(`[createPicnicEvent] ${data.summary}`);
      const endDateTime = new Date(data.startDateTime);
      endDateTime.setHours(endDateTime.getHours() + (data.durationHours || 3));

      const locationString = data.latitude && data.longitude
        ? `${data.locationName || 'Punto de encuentro'} https://maps.google.com/?q=${data.latitude},${data.longitude}`
        : data.locationName || 'Lugar a convenir';

      const event = {
        summary: data.summary,
        location: locationString,
        description: data.description,
        colorId: !production ? '10' : '6',
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
        ],
        guestsCanSeeOtherGuests: true,
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 2 * 24 * 60 }, // Notificación 2 día antes
            { method: 'popup', minutes: 24 * 60 }, // Notificación 1 día antes
            { method: 'popup', minutes: 120 },     // Notificación 2 horas antes
            ...(!production ? [
              { method: 'popup', minutes: 180 },     // Notificación 3 horas antes
              { method: 'popup', minutes: 60 },     // Notificación 1 horas antes
            ] : [])
          ],
        },
      };

      const response = await this.calendar.events.insert({
        calendarId: "primary",
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

  async createProductionEvent(data: ICalendarEvent): Promise<string | null> {
    try {
      this.logger.log(`[createProductionEvent] ${data.summary}`);
      const endDateTime = new Date(data.startDateTime);
      endDateTime.setHours(endDateTime.getHours() + (data.durationHours || 4));

      const locationString = data.latitude && data.longitude
        ? `${data.locationName || 'Punto de encuentro'} https://maps.google.com/?q=${data.latitude},${data.longitude}`
        : data.locationName || 'Lugar a convenir';

      const event = {
        summary: data.summary,
        location: locationString,
        description: data.description,
        colorId: '6',
        start: {
          dateTime: data.startDateTime.toISOString(),
          timeZone: 'America/Argentina/Buenos_Aires',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'America/Argentina/Buenos_Aires',
        },
        attendees: [
          ...PRODUCTION_EMAIL,
        ],
        guestsCanSeeOtherGuests: true,
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 2 * 24 * 60 }, // Notificación 2 día antes
            { method: 'popup', minutes: 24 * 60 }, // Notificación 1 día antes
            { method: 'popup', minutes: 120 },     // Notificación 2 horas antes
          ],
        },
      };

      const response = await this.calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
        sendUpdates: 'all',
      });

      this.logger.log(`[createProductionEvent] Evento creado con éxito ID: ${response.data.id}`);
      return response.data.htmlLink || null;
    } catch (error) {
      this.logger.error(`Error al crear evento en Google Calendar: ${error.message}`, error.stack);
      return null;
    }
  }

  public createEventDescription(picnic: IPicnicDetail, exchangeRate: number = 1535, production = false): string {
    const { clientInfo, maxGuest, eventDate, eventTime, place, event, package: pkg, additionals, totalAmount, depositAmount, pendingAmount, paymentMethod } = picnic;

    const courtesyAmount = Math.ceil(maxGuest / 4)
    const dateObj = new Date(eventDate);
    const formattedDate = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;

    const startHour = parseInt(eventTime.split(':')[0], 10);
    const startMinutes = eventTime.split(':')[1] || '00';

    const formatTime12h = (hour24: number, minutes: string) => {
      const period = hour24 >= 12 ? 'p.m.' : 'a.m.';
      const hour12 = hour24 % 12 || 12;
      return `${hour12.toString().padStart(2, '0')}:${minutes} ${period} hs`;
    };

    const startTimeFormatted = formatTime12h(startHour, startMinutes);
    const endTimeFormatted = formatTime12h(startHour + 3, startMinutes);

    const includedItemsList = !production && pkg.includedItems && pkg.includedItems.length > 0
      ? pkg.includedItems.map((item) => `• ${item}`).join('\n')
      : this.getEventChecklist(picnic);


    const additionalsList = additionals && additionals.length > 0
      ? additionals.map((add) => `• ${add.quantity}x ${add.cost.name} ${!production ? `: ${add.totalPrice} US$` : ''}`).join('\n')
      : 'Sin adicionales';

    const totalInPesos = (totalAmount * exchangeRate).toLocaleString('es-AR');
    const depositInPesos = (depositAmount * exchangeRate).toLocaleString('es-AR');
    const pendingInPesos = (pendingAmount * exchangeRate).toLocaleString('es-AR');

    // 6. Construcción del Template Literal
    return `🧺 NÓMADA PICNIC - ${pkg.name.toUpperCase()} ${event.name.toUpperCase()} 🧺
  
👤 Cliente: ${clientInfo.name} ${clientInfo.lastname}
👥 Invitados: ${maxGuest}
📅 Fecha: ${formattedDate}
📍 Lugar: ${place.name} (${place.address || 'Sin dirección'})
☁️ Clima: POR DEFINIR

🕒 HORARIOS:
Inicio: ${startTimeFormatted}
Cierre: ${endTimeFormatted}

✨ INCLUYE:
${includedItemsList}

➕ Adicionales:
${additionalsList}

🎁 CORTESÍA:
${courtesyAmount} bebidas 🍾 (${clientInfo.giftDrinks.map(item => DRINKS_MAP[item]).join(', ')})
${courtesyAmount} Servicios de pan y Untable 🥖
${maxGuest} Medialunas de cortesía 🥐

💲 PRECIOS: 
Costo básico picnic: ${pkg.name} (${picnic.basePrice} US$)
 -> Tasa de cambio: $${exchangeRate.toLocaleString('es-AR')} por US$.
Precio total: ${totalAmount} US$ ~ $${totalInPesos}

💵 PAGOS:
${pendingAmount != 0 ? `Pago reserva: $${depositInPesos} ARS.` : ''}
Forma de pago: ${PAYMENT_METHODS_MAP[paymentMethod]}
Pago restante: ${pendingAmount} US$ / $${pendingInPesos} ARS.

AGRADECEMOS UNA VEZ SE HACE EL CHECK IN (ENTREGA) DEL PICNIC PROCEDER AL PAGO COMPLETO. ¡GRACIAS!`;
  }

  public getEventChecklist(picnic: IPicnicDetail): string {
    let tableNumber = 0
    let blanketsNumber = 0
    let toIgnore = []
    switch (picnic.package.name) {
      case PICNIC_NAMES.CELEBRATION:
        tableNumber = Math.ceil(picnic.maxGuest / 6)
        blanketsNumber = tableNumber * 2
        toIgnore = ['stemware', 'cups']
        break;
      case PICNIC_NAMES.SIGNATURE:
        tableNumber = Math.ceil(picnic.maxGuest / 6)
        blanketsNumber = tableNumber * 2
        toIgnore = ['meson', 'cups', ...(picnic.maxGuest > 9 ? 'plasticStemwares' : 'stemware')]
        break;
      case PICNIC_NAMES.CLASSIC:
        tableNumber = picnic.maxGuest > 20 ? 2 : 1
        blanketsNumber = Math.ceil(picnic.maxGuest / 5) + 2
        toIgnore = ['meson', 'stemware', 'cups', 'plates', 'placemats']
        break;
      default:
        blanketsNumber = Math.ceil(picnic.maxGuest / 5)
        tableNumber = 0
        toIgnore = ['table', 'meson', 'plasticStemwares', 'bigboards', 'plates', 'placemats']
        break;
    }

    return CHECKLIST_ELEMENTS
      .filter(item => !toIgnore.includes(item.code))
      .map(item => {
        let label
        switch (item.code) {
          case 'icebucket':
          case 'flowervase':
          case 'bigflowervase':
          case 'table':
          case 'breakfastTable':
            label = `${item.label} x${tableNumber}`
            break;
          case 'blankets':
            label = `${item.label} x${blanketsNumber}`
            break;
          case 'glasses':
          case 'stemware':
          case 'plasticStemwares':
          case 'cups':
          case 'plates':
          case 'placemats':
            label = `${item.label} x${picnic.maxGuest}`
            break;
          case 'cushion':
            label = `${item.label} x${picnic.maxGuest * 2}`
            break;
          case 'breadbaskets':
            label = `${item.label} x${Math.ceil(picnic.maxGuest / 4)}`
            break;
          case 'icecan':
          case 'dispensers':
          case 'roundboards':
          case 'smallboards':
          case 'bigboards':
            label = `${item.label} x${Math.ceil(picnic.maxGuest / 8)}`
            break;
          case 'tul':
            label = `${item.label} x${tableNumber * 2}`
            break;
          default:
            label = item.label
        }
        return label
      })
      .map((label) => {
        return `• ${label}`
      }).join('\n')
  }
}