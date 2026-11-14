export interface ICalendarEvent {
  summary: string;             // ej: "Nómada Picnic - Reserva NP-2026-00152"
  description: string;         // Detalle de la experiencia, cantidad de personas, etc.
  clientEmail: string;         // Email del cliente para enviarle la invitación
  clientName: string;          // Nombre del cliente
  eventDate: Date | string;    // Día del picnic (se interpreta en hora de Argentina)
  eventTime: string;           // Hora de inicio del picnic, formato "HH:mm" en hora de Argentina
  startOffsetMinutes?: number; // Desplazamiento del inicio respecto a eventTime (ej: -60 para producción)
  durationHours: number;       // Duración (ej: 3 horas)
  latitude?: number;           // Coordenadas latitud
  longitude?: number;          // Coordenadas longitud
  locationName?: string;       // ej: "Bosques de Palermo"
}