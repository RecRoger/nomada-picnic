export interface ICalendarEvent {
  summary: string;             // ej: "Nómada Picnic - Reserva NP-2026-00152"
  description: string;         // Detalle de la experiencia, cantidad de personas, etc.
  clientEmail: string;         // Email del cliente para enviarle la invitación
  clientName: string;          // Nombre del cliente
  startDateTime: Date;         // Fecha y hora de inicio del picnic
  durationHours: number;       // Duración (ej: 3 horas)
  latitude?: number;           // Coordenadas latitud
  longitude?: number;          // Coordenadas longitud
  locationName?: string;       // ej: "Bosques de Palermo"
}