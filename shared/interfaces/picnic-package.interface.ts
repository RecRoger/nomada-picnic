export interface IPicnicPackage {
  _id?: string;
  name: string;
  description: string;
  tag?: string;
  detail?: string;
  image?: string;
  minGuests?: number;
  maxGuests?: number;
  extraTransport?: number;
  includedItems?: string[];
  profitPercent?: number;       // % de Ganancia (ej: 35%)
  expensesPercent?: number; // % para cubrir Gastos Generales (ej: 15%)
  bigExpensesPercent?: number; // % para cubrir Gastos Generales (ej: 15%)
  productionCostIds?: string[];       // Costos de producción que aplican a este paquete
  baseCost?: number; // Costo base calculado para la menor cantidad de invitados posible
  minPrice?: number; // Precio minimo calculado para la menor cantidad de invitados posible
}