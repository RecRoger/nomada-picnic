import { isPlatformBrowser } from '@angular/common';
import { Injectable, signal, computed, inject, effect, PLATFORM_ID } from '@angular/core';
import { CostsService } from '@services/costs.service';
import { PackagesService } from '@services/packages.service';
import { CostsTypes } from '@shared/enums';
import { IBookingCart, IBookingClientInfo, ICartAdditional, ICost, IPicnicBooking } from '@shared/interfaces';

const CART_STORAGE_KEY = 'nomada_picnic_cart';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  protected packagesService = inject(PackagesService);
  protected additionalsService = inject(CostsService);

  public isOpen = signal<boolean>(false);
  public showDetails = signal<boolean>(false); // 💡 Controla el estado expandido

  private cartState = signal<IBookingCart>({
    booking: null,
    additionals: [],
  });

  public booking = computed(() => this.cartState().booking);

  public additionals = computed(() => this.cartState().additionals);

  public clientForm = computed(() => this.cartState().clientInfo);

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

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    if (this.isBrowser) {
      const savedCart = this.loadCartFromStorage();
      if (savedCart) {
        this.cartState.set(savedCart);
      }
    }
    effect(() => {
      const currentCart = this.cartState();
      if (this.isBrowser) {
        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentCart));
        } catch (error) {
          console.error('Error guardando el carrito en localStorage:', error);
        }
      }
    });
  }

  private loadCartFromStorage(): IBookingCart | null {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return null;

      const parsed = JSON.parse(saved) as IBookingCart;

      // Deserializar la fecha si existía en el almacenamiento
      if (parsed.booking?.eventDate) {
        parsed.booking.eventDate = new Date(parsed.booking.eventDate);
      }

      return parsed;
    } catch (error) {
      console.error('Error leyendo carrito de localStorage:', error);
      return null;
    }
  }

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
        const current = updatedAdditionals[existingIndex];
        updatedAdditionals[existingIndex] = {
          ...current,
          totalPrice: current.cost.finalPrice! * current.quantity + quantity,
          quantity: current.quantity + quantity,
        };
      } else {
        updatedAdditionals.push({
          cost: newAdditional,
          unitPrice: newAdditional.finalPrice || 0,
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

  updateClientInfo(clientForm: IBookingClientInfo) {
    this.cartState.update((state) => {
      return {
        ...state,
        clientInfo: { ...clientForm },
      };
    });
  }

  /** Limpia completamente el carrito */
  public clearCart(): void {
    this.cartState.set({
      booking: null,
      additionals: [],
      clientInfo: undefined
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