import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyCode, CurrencyConfig, CurrencyService } from '@services/currency.service';

@Component({
  selector: 'app-currency-selector',
  imports: [
    ReactiveFormsModule, MatIconModule],
  templateUrl: './currency-selector.component.html',
  styleUrl: './currency-selector.component.scss'
})
export class CurrencySelectorComponent {
  protected readonly currencyService = inject(CurrencyService);
  private readonly elementRef = inject(ElementRef);

  // Estado de visibilidad del desplegable
  protected readonly isOpen = signal<boolean>(false);

  // Mapeo de banderas SVG usando banderas vectoriales confiables de CDN (Flagpack / Flag Icons)
  protected readonly flagUrls: Record<CurrencyCode, string> = {
    USD: 'images/graphics/US.svg',
    ARS: 'images/graphics/AR.svg',
    BRL: 'images/graphics/BR.svg'
  };

  protected get availableCurrencies(): CurrencyConfig[] {
    return Object.values(this.currencyService.currencies());
  }

  protected toggleDropdown(): void {
    this.isOpen.update(open => !open);
  }

  protected selectCurrency(code: CurrencyCode): void {
    this.currencyService.setCurrency(code);
    this.isOpen.set(false);
  }

  // Cierra el selector automáticamente al hacer clic fuera de él
  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
