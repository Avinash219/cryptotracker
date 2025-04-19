import { Pipe, PipeTransform } from '@angular/core';
import { CURRENCY_NAME_MAP } from '../constants/currency-name.map';

@Pipe({
  name: 'currencyName',
})
export class CurrencyNamePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    return CURRENCY_NAME_MAP[value.toLowerCase()] ?? value.toUpperCase();
  }
}
