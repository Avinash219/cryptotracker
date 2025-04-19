import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { CryptoApiService } from '../../core/crypto-api.service';
import { interval, map, startWith, switchMap, tap, withLatestFrom } from 'rxjs';
import { CurrencyStore } from '../currency-switcher-dropdown/Currency.Store';

export interface DashboardState {
  coins: any[];
  loading: boolean;
  error: string | null;
  selectedCurrency: string;
}

@Injectable()
export class DashboardStore extends ComponentStore<DashboardState> {
  private api = inject(CryptoApiService);
  private currencyStore = inject(CurrencyStore);

  constructor() {
    super({
      coins: [],
      loading: false,
      error: null,
      selectedCurrency: 'usd',
    });
  }

  readonly coin$ = this.select((state) => state.coins);
  readonly loading$ = this.select((state) => state.loading);
  readonly error$ = this.select((state) => state.error);

  readonly setLoading = this.updater((state, loading: boolean) => ({
    ...state,
    loading,
  }));

  readonly setCoins = this.updater((state, coins: any[]) => ({
    ...state,
    coins,
    error: null,
  }));

  readonly setError = this.updater((state, error: string) => ({
    ...state,
    error,
    loading: false,
  }));

  fetchCoins(currency?: string) {
    this.fetchTopCoins(currency);
  }
  readonly fetchTopCoins = this.effect<string | undefined>((currency$) =>
    currency$.pipe(
      tap({
        next: () => {
          this.setLoading(true), this.setCoins([]);
        },
      }),
      withLatestFrom(this.currencyStore.selectedCurrency$),
      switchMap(([_, currency]) => {
        return this.api.getTopCoins(currency).pipe(
          tap({
            next: (coins) => {
              this.setCoins(coins), this.setLoading(false);
            },
            error: () => this.setError('Unable to Load Coins'),
          })
        );
      })
    )
  );
}
