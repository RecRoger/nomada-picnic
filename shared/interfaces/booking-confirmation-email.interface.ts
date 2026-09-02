export interface IBookingConfirmationEmail {
  clientName: string;                     // ej: 'Elizabeth'
  bookingNumber: string;                  // ej: 'NP-2026-00152'
  experienceName: string;                 // ej: 'Picnic Signature'
  guestsCount: string;                    // ej: 8
  eventDateFormatted: string;             // ej: '12 de octubre de 2026'
  eventTime: string;                      // ej: '17:00 hs'
  locationName: string;                   // ej: 'Bosques de Palermo'
  celebrationType: string;                // ej: 'Cumpleaños'

  // Financiero
  isDeposit: boolean;                     // true si pagó el 50% / false si fue 100%
  subtotalFormatted: string;              // ej: '445.000'
  paidAmountFormatted: string;            // ej: '133.500' o '222.500'
  pendingAmountFormatted: string;         // ej: '311.500'

  // Lista de Adicionales
  additionals: Array<{
    name: string;                         // ej: 'Tabla de frutas'
    priceFormatted: string;               // ej: '30.000'
  }>;

  // Logística / Instrucciones
  durationHours: number;                  // ej: 3

  // Links Dinámicos
  manageBookingUrl: string;               // ej: 'https://nomadapicnic.com/mi-reserva?id=NP-2026-00152'
  whatsappUrl: string;                    // ej: 'https://wa.me/5491112345678?text=Hola!%20Tengo%20una%20consulta%20sobre%20mi%20reserva%20NP-2026-00152'
  faqUrl: string;                         // ej: 'https://nomadapicnic.com/preguntas-frecuentes'
  cancellationPolicyUrl: string;          // ej: 'https://nomadapicnic.com/politica-cancelacion'
}