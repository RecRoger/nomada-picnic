import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '@services/cart.service';

export const checkoutGuard: CanActivateFn = (route, state) => {
  const cartService = inject(CartService);
  const router = inject(Router);

  const isEmpty = cartService.isEmpty() || !cartService.booking();
  const isIncomplete = cartService.isIncomplete();
  if (isEmpty || isIncomplete) {
    return router.createUrlTree(['/picnics']);
  }

  return true;
};