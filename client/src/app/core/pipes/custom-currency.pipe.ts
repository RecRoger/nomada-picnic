import { inject, Pipe, PipeTransform } from '@angular/core';
import { CurrencyService } from '@services/currency.service';

@Pipe({
  name: 'customCurrency',
  pure: false
})
export class CustomCurrencyPipe implements PipeTransform {
  private readonly currencyService = inject(CurrencyService);

  transform(amountInUSD: number | null | undefined, customDecimals?: number): string {
    if (amountInUSD == null || isNaN(amountInUSD)) {
      return '';
    }

    // Leemos directamente los Signals dentro del método transform
    const config = this.currencyService.activeConfig();
    const convertedValue = amountInUSD * config.rate;
    const decimals = customDecimals ?? config.decimals;

    // Seleccionamos el locale según la divisa para formatear separadores correctamente
    const localeMap: Record<string, string> = {
      USD: 'en-US',
      ARS: 'es-AR',
      BRL: 'pt-BR'
    };

    const formattedNumber = new Intl.NumberFormat(localeMap[config.code] ?? 'es-AR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(convertedValue);

    return `${config.symbol} ${formattedNumber}`;
  }
}
