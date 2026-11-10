import { PaymentMethods } from '../enums/payment-types.enum';

export const PAYMENT_METHODS_MAP: Record<string, string> = {
  [PaymentMethods.MP]: 'Mercado Pago',
  [PaymentMethods.CASH_DOLLAR]: 'Dolares en efectivo',
  [PaymentMethods.CASH_PESOS]: 'Pesos en efectivo',
  [PaymentMethods.TRANSFER_DOLLAR]: 'Transferencia en dolares',
  [PaymentMethods.TRANSFER_PESOS]: 'Transferencia en pesos',
  [PaymentMethods.CRYPTO]: 'Transferencia en cryptomoneda',
  [PaymentMethods.OTHER]: 'Otro método',
} satisfies Record<PaymentMethods, string>;
