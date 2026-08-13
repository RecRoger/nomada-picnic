import { Injectable, signal, computed } from '@angular/core';


// TODO - modificar interfaz de carrito
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  icon?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Estado de visibilidad del Sidenav/Drawer
  isOpen = signal<boolean>(false);

  showDetails = signal<boolean>(false); // 💡 Controla el estado expandido

  // Lista de items en el carrito
  items = signal<CartItem[]>([]);

  // Totales calculados automáticamente
  totalItems = computed(() =>
    this.items().reduce((acc, item) => acc + item.quantity, 0)
  );

  totalAmount = computed(() =>
    this.items().reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  toggleCart() {
    this.isOpen.update((prev) => !prev);
  }

  toggleDetails() {
    this.showDetails.update((val) => !val);
  }

  openCart() {
    this.isOpen.set(true);
  }

  closeCart() {
    this.isOpen.set(false);
  }

  addItem(newItem: CartItem) {
    this.items.update((currentItems) => {
      const index = currentItems.findIndex((item) => item.id === newItem.id);
      if (index > -1) {
        const updated = [...currentItems];
        updated[index].quantity += newItem.quantity;
        return updated;
      }
      return [...currentItems, newItem];
    });
    this.openCart(); // Abre automáticamente el carrito al agregar un producto
  }
}