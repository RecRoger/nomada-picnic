import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { catchError, forkJoin, of } from 'rxjs';

export type CurrencyCode = 'USD' | 'ARS' | 'BRL';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  flag: string; // Emoji de bandera
  rate: number;
  decimals: number;
}

interface DolarApiResponse {
  compra: number;
  venta: number;
}

interface ExchangeRateApiResponse {
  rates: Record<string, number>;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly currentCurrency = signal<CurrencyCode>('USD');

  // Configuración y tasas de cambio
  // (Puedes actualizarlas mediante un endpoint o WebSocket según necesites)
  public currencies = signal<Record<CurrencyCode, CurrencyConfig>>({
    USD: { code: 'USD', symbol: 'US$', flag: '🇺🇸', rate: 1, decimals: 2 },
    ARS: { code: 'ARS', symbol: '$', flag: '🇦🇷', rate: 1530, decimals: 0 },
    BRL: { code: 'BRL', symbol: 'R$', flag: '🇧🇷', rate: 5.22, decimals: 2 }
  });

  readonly activeConfig = computed(() => this.currencies()[this.currentCurrency()]);

  constructor() {
    if (this.isBrowser) {
      const savedCurrency = localStorage.getItem('nomada_currency') as CurrencyCode;
      if (savedCurrency && this.currencies()[savedCurrency]) {
        this.currentCurrency.set(savedCurrency);
      }
    }
  }

  public setCurrency(code: CurrencyCode): void {
    if (!this.currencies()[code]) return;
    this.currentCurrency.set(code);
    if (this.isBrowser) {
      localStorage.setItem('nomada_currency', code);
    }
  }

  public convert(amountInUSD: number): { value: number; config: CurrencyConfig } {
    const config = this.activeConfig();
    const convertedValue = amountInUSD * config.rate;
    return { value: convertedValue, config };
  }

  fetchExchangeRates(): void {
    const ars$ = this.http.get<DolarApiResponse>('https://dolarapi.com/v1/dolares/oficial').pipe(
      catchError(err => {
        console.error('Error al obtener cotización ARS:', err);
        return of(null);
      })
    );

    const brl$ = this.http.get<ExchangeRateApiResponse>('https://open.er-api.com/v6/latest/USD').pipe(
      catchError(err => {
        console.error('Error al obtener cotización BRL:', err);
        return of(null);
      })
    );

    forkJoin([ars$, brl$]).subscribe(([arsData, brlData]) => {
      this.currencies.update(current => {
        const updated = { ...current };
        if (arsData?.venta) {
          updated.ARS = {
            ...updated.ARS,
            rate: arsData.venta
          };
        }
        if (brlData?.rates?.['BRL']) {
          updated.BRL = {
            ...updated.BRL,
            rate: brlData.rates['BRL']
          };
        }

        return updated;
      });
    });
  }
}
