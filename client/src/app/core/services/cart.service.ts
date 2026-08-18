import { Injectable, signal, computed, inject } from '@angular/core';
import { CostsService } from '@services/costs.service';
import { PackagesService } from '@services/packages.service';
import { CostsTypes } from '@shared/enums';
import { IBookingCart, ICartAdditional, ICost, IPicnicBooking } from '@shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  protected packagesService = inject(PackagesService);
  protected additionalsService = inject(CostsService);

  // Estado de visibilidad del Sidenav/Drawer
  public isOpen = signal<boolean>(false);
  public showDetails = signal<boolean>(false); // 💡 Controla el estado expandido

  private cartState = signal<IBookingCart>({
    booking: null,
    additionals: [],
  });

  public booking = computed(() => this.cartState().booking);

  public additionals = computed(() => this.cartState().additionals);

  additionalsTotal = computed(() => {
    return this.cartState().additionals.reduce(
      (total, item) => total + item.totalPrice,
      0
    );
  });

  public totalItems = computed(() => {
    const hasBooking = this.cartState().booking ? 1 : 0;
    const additionalsCount = this.cartState().additionals.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );
    return hasBooking + additionalsCount;
  });

  public totalAmount = computed(() => {
    const bookingPrice = this.cartState().booking?.basePrice ?? 0;
    return bookingPrice + this.additionalsTotal();
  });


  public isIncomplete = computed(() => {
    const booking = this.cartState().booking
    return booking && (!booking.package || !booking.place || !booking.event || !booking.eventDate || !booking.eventTime)
  });

  public isEmpty = computed(() => !this.cartState().booking && this.cartState().additionals.length === 0);

  // --- MÉTODOS DE ACCIÓN / MUTACIONES DE ESTADO ---
  /** Actualiza parcialmente campos de la reserva */
  updateBookingDetails(partialBooking: Partial<IPicnicBooking>) {
    this.cartState.update((state) => {
      return {
        ...state,
        booking: { ...(state.booking || {}), ...partialBooking },
      };
    });
  }

  /** Elimina la reserva de picnic del carrito */
  removeBooking() {
    this.cartState.update((state) => ({
      ...state,
      booking: null,
    }));
  }

  /** Agrega un adicional o incrementa su cantidad */
  addAdditional(newAdditional: ICost, quantity: number) {
    this.cartState.update((state) => {
      const existingIndex = state.additionals.findIndex(
        (a) => a.cost._id === newAdditional._id
      );

      let updatedAdditionals = [...state.additionals];

      if (existingIndex > -1) {
        // Si ya existe, incrementamos la cantidad
        const current = updatedAdditionals[existingIndex];
        updatedAdditionals[existingIndex] = {
          ...current,
          totalPrice: current.cost.finalPrice! * current.quantity + quantity,
          quantity: current.quantity + quantity,
        };
      } else {
        // Si no existe, lo agregamos completo
        updatedAdditionals.push({
          cost: newAdditional,
          quantity,
          totalPrice: newAdditional.finalPrice! * quantity
        });
      }

      return { ...state, additionals: updatedAdditionals };
    });
  }

  /** Modifica la cantidad exacta de un adicional o lo remueve si es <= 0 */
  updateAdditionalQuantity(additionalCostId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeAdditional(additionalCostId);
      return;
    }

    this.cartState.update((state) => ({
      ...state,
      additionals: state.additionals.map((a) =>
        a.cost._id === additionalCostId ? {
          ...a,
          totalPrice: a.cost.finalPrice! * quantity,
          quantity
        } : a
      ),
    }));
  }

  /** Remueve completamente un adicional */
  removeAdditional(additionalCostId: string) {
    this.cartState.update((state) => ({
      ...state,
      additionals: state.additionals.filter(
        (a) => a.cost._id !== additionalCostId
      ),
    }));
  }

  /** Limpia completamente el carrito */
  public clearCart(): void {
    this.cartState.set({
      booking: null,
      additionals: [],
    });
  }

  // --- CONTROLES DE UI ---
  public toggleDetails(forceClose?: boolean): void {
    this.showDetails.update((val) => forceClose ?? !val);
  }

  public openCart(): void {
    this.isOpen.set(true);
  }

  public closeCart(): void {
    this.isOpen.set(false);
    this.showDetails.set(false);
  }
}