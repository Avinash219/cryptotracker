import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

export interface PaginatorState {
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  totalRecords: number;
}

@Injectable()
export class PaginatorStore extends ComponentStore<PaginatorState> {
  constructor() {
    super({
      pagination: {
        pageIndex: 1,
        pageSize: 10,
      },
      totalRecords: 0,
    });
  }

  readonly pagination$ = this.select((state) => state.pagination);
  readonly totalRecords$ = this.select((state) => state.totalRecords);

  readonly setPagination = this.updater((state, pagination: any) => ({
    ...state,
    pagination,
  }));

  readonly setTotalRecords = this.updater((state, totalRecords: number) => ({
    ...state,
    totalRecords,
  }));
}
