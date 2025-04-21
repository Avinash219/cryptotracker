import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { CryptoApiService } from '../../core/crypto-api.service';
import { concatMap, EMPTY, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { CurrencyStore } from '../currency-switcher-dropdown/Currency.Store';
import { PaginatorStore } from '../../shared/paginator/paginator.store';
import { SearchStore } from '../search/search.store';

export interface DashboardState {
  coins: any[];
  loading: boolean;
  error: string | null;
  selectedCurrency: string;
}

@Injectable()
export class DashboardStore extends ComponentStore<DashboardState> {
  private api = inject(CryptoApiService);
  private paginationStore = inject(PaginatorStore);
  private currencyStore = inject(CurrencyStore);
  private searchStore = inject(SearchStore);

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

  readonly fetchCoins = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap({
        next: () => {
          this.setLoading(true), this.setCoins([]);
        },
      }),
      concatMap(() =>
        this.api
          .getAllCoinList()
          .pipe(
            tap((response) =>
              this.paginationStore.setTotalRecords(response.length)
            )
          )
      ),
      withLatestFrom(
        this.currencyStore.selectedCurrency$,
        this.paginationStore.pagination$
      ),
      switchMap(([_, currency, paginationParams]) => {
        return this.api.getTopCoins(currency, paginationParams).pipe(
          tap({
            next: (coins) => {
              console.log(coins);
              this.setCoins(coins), this.setLoading(false);
            },
            error: () => this.setError('Unable to Load Coins'),
          })
        );
      })
    )
  );

  readonly refreshCoinsBasedOnSearchTerm = this.effect<void>((trigger$) =>
    trigger$.pipe(
      withLatestFrom(this.searchStore.searchTerm$),
      switchMap(([_, searchTerm]) => {
        if (searchTerm && searchTerm?.trim()?.length > 3) {
          this.searchStore.searchEffect(of(searchTerm));
          return EMPTY;
        } else {
          return of(null).pipe(tap(() => this.fetchCoins()));
        }
      })
    )
  );
}
