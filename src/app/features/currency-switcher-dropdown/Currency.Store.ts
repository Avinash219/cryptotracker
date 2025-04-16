import { ComponentStore } from '@ngrx/component-store';
import { CryptoApiService } from '../../core/crypto-api.service';
import { catchError, of, switchMap, tap } from 'rxjs';
import { Injectable } from '@angular/core';

interface CurrencyState {
  supportedCurrencyList: Array<string>;
  selectedCurrency: string;
}

@Injectable({
  providedIn: 'root',
})
export class CurrencyStore extends ComponentStore<CurrencyState> {
  constructor(private api: CryptoApiService) {
    super({
      selectedCurrency: 'usd',
      supportedCurrencyList: [],
    });
    this.loadSupportedCurrency();
  }

  readonly selectedCurrency$ = this.select((s) => s.selectedCurrency);
  readonly supportedCurrencyList$ = this.select((s) => s.supportedCurrencyList);

  readonly setCurrency = this.updater<string>((state, currency) => ({
    ...state,
    selectedCurrency: currency,
  }));

  readonly loadSupportedCurrency = this.effect<void>((trigger$) =>
    trigger$.pipe(
      switchMap(() =>
        this.api.getCurrencyList().pipe(
          tap((response: Array<string>) => {
            this.patchState({ supportedCurrencyList: response });
          }),
          catchError((error: any) => {
            console.log('Unable to Fetch Currency List');
            return of(null);
          })
        )
      )
    )
  );
}
