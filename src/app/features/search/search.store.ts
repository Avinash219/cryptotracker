import { inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
  concatMap,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { CryptoApiService } from '../../core/crypto-api.service';
import { PaginatorStore } from '../../shared/paginator/paginator.store';

export interface SearchState {
  result: any[];
  loading: boolean;
  error: string | null;
  searchTerm: string | null;
}

export class SearchStore extends ComponentStore<SearchState> {
  api = inject(CryptoApiService);
  paginationStore = inject(PaginatorStore);

  constructor() {
    super({
      result: [],
      loading: false,
      error: null,
      searchTerm: null,
    });
  }

  results$ = this.select((state) => state.result);
  loading$ = this.select((state) => state.loading);
  error$ = this.select((state) => state.error);
  searchTerm$ = this.select((state) => state.searchTerm);

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

  readonly setSearchTerm = this.updater((state, searchTerm: string) => ({
    ...state,
    searchTerm,
  }));

  readonly searchEffect = this.effect<string>((searchTerm$) =>
    searchTerm$.pipe(
      tap(() => console.log(searchTerm$)),
      debounceTime(400),
      filter((term) => !!term),
      tap(() => this.setLoading(true)),
      concatMap((term) =>
        this.api.getCoinsBySearch(term).pipe(
          tap((res: any) => {
            this.paginationStore.setTotalRecords(res?.coins?.length);
          }),
          map((res: any) => res?.coins.map((coin: any) => coin.id))
        )
      ),
      withLatestFrom(this.paginationStore.pagination$),
      switchMap(([ids, pagination]) => {
        return this.api.getCoinSearchById(ids, pagination).pipe(
          tap((result) => {
            this.setLoading(false);
            this.setResult(result);
          })
        );
      })
    )
  );
}
