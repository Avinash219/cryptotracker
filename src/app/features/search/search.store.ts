import { inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs';
import { CryptoApiService } from '../../core/crypto-api.service';

export interface SearchState {
  result: any[];
  loading: boolean;
  error: string | null;
}

export class SearchStore extends ComponentStore<SearchState> {
  api = inject(CryptoApiService);
  constructor() {
    super({
      result: [],
      loading: false,
      error: null,
    });
  }

  results$ = this.select((state) => state.result);
  loading$ = this.select((state) => state.loading);
  error$ = this.select((state) => state.error);

  readonly setLoading = this.updater(
    (state: SearchState, loading: boolean) => ({
      ...state,
      loading,
    })
  );

  readonly setError = this.updater(
    (state: SearchState, error: string | null) => ({
      ...state,
      error,
    })
  );

  readonly setResult = this.updater((state: SearchState, result: []) => ({
    ...state,
    result,
  }));

  readonly searchEffect = this.effect<string>((searchTerm$) =>
    searchTerm$.pipe(
      tap(() => console.log(searchTerm$)),
      debounceTime(400),
      filter((term) => !!term),
      tap(() => this.setLoading(true)),
      switchMap((term) =>
        this.api.getCoinsBySearch(term).pipe(
          tap({
            next: (result) => {
              this.setLoading(false);
              this.setResult(result);
            },
            error: (error) => {
              this.setLoading(false);
              this.setError('Failed to search data');
            },
          })
        )
      )
    )
  );
}
