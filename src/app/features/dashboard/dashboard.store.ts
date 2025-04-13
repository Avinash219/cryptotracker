import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { CryptoApiService } from '../../core/crypto-api.service';
import { interval, startWith, switchMap, tap } from 'rxjs';

export interface DashboardState {
  coins: any[];
  loading: boolean;
  error: string | null;
}

@Injectable()
export class DashboardStore extends ComponentStore<DashboardState> {
  private api = inject(CryptoApiService);

  constructor() {
    super({
      coins: [],
      loading: false,
      error: null,
    });
    this.fetchTopCoins();
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

  readonly fetchTopCoins = this.effect<void>((trigger$) =>
    trigger$.pipe(
      startWith(0),
      tap({
        next: () => {
          this.setLoading(true), this.setCoins([]);
        },
      }),
      switchMap(() =>
        this.api.getTopCoins().pipe(
          tap({
            next: (coins) => {
              this.setCoins(coins), this.setLoading(false);
            },
            error: () => this.setError('Unable to Load Coins'),
          })
        )
      )
    )
  );
}
