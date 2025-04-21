import { Component, inject, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DashboardStore } from '../../features/dashboard/dashboard.store';
import { AsyncPipe } from '@angular/common';
import { PaginatorStore } from './paginator.store';
import { SearchStore } from '../../features/search/search.store';
import { of, take, tap } from 'rxjs';

@Component({
  selector: 'app-paginator',
  imports: [MatPaginatorModule, AsyncPipe],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  paginatorStore = inject(PaginatorStore);
  dashboardStore = inject(DashboardStore);
  searchStore = inject(SearchStore);
  totalRecords$ = this.paginatorStore.totalRecords$;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageEvent({ pageIndex, pageSize }: { pageIndex: number; pageSize: number }) {
    this.paginatorStore.setPagination({
      pageIndex: ++pageIndex,
      pageSize,
    });
    this.dashboardStore.refreshCoinsBasedOnSearchTerm();
  }

  resetToFirstPage() {
    this.paginator.firstPage();
  }
}
