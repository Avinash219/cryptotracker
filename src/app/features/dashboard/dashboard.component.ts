import {
  ChangeDetectorRef,
  Component,
  inject,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { filter, of, startWith, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { DashboardStore } from './dashboard.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SearchStore } from '../search/search.store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CoinDetailDrawerComponent } from '../coin-detail-drawer/coin-detail-drawer.component';
import { CurrencySwitcherDropdownComponent } from '../currency-switcher-dropdown/currency-switcher-dropdown.component';
import { CurrencyStore } from '../currency-switcher-dropdown/Currency.Store';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';
import { PaginatorStore } from '../../shared/paginator/paginator.store';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInput,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    CurrencySwitcherDropdownComponent,
    PaginatorComponent,
  ],
  providers: [DashboardStore, SearchStore, PaginatorStore],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  store = inject(DashboardStore);
  searchStore = inject(SearchStore);
  currencyStore = inject(CurrencyStore);
  searchControl = new FormControl<string | null>(null);
  @ViewChild('coinDetailDrawer', { read: ViewContainerRef })
  coinDetailDrawerRef!: ViewContainerRef;
  paginatorStore = inject(PaginatorStore);
  @ViewChild(PaginatorComponent) paginator!: PaginatorComponent;

  coin$ = this.searchControl.valueChanges.pipe(
    startWith(null),
    tap((value) => this.searchStore.setSearchTerm(value ?? '')),
    switchMap((searchTerm) => {
      this.paginatorStore.setPagination({
        pageIndex: 1,
        pageSize: 10,
      });
      this.paginator?.resetToFirstPage();
      return searchTerm?.trim().length && searchTerm?.trim().length > 3
        ? this.searchStore.results$
        : this.store.coin$;
    })
  );
  loading$ = this.store?.loading$;
  error$ = this.store?.error$;
  selectedCurrency$ = this.currencyStore.selectedCurrency$;

  displayedColumns = ['image', 'name', 'price', 'change'];

  ngOnInit() {
    this.searchWithParam();
  }

  refreshCoinDetails() {
    if (
      this.searchControl?.value &&
      this.searchControl?.value?.trim().length > 3
    ) {
      this.searchStore.searchEffect(of(this.searchControl.value));
    } else {
      this.store?.fetchCoins();
    }
    if (this.paginator) {
      this.paginator?.resetToFirstPage();
    }
  }

  onClear() {
    this.searchControl.setValue(null);
    this.store?.fetchCoins();
    this.paginator?.resetToFirstPage();
  }

  searchWithParam() {
    this.searchStore.searchEffect(
      this.searchControl.valueChanges.pipe(
        filter((value): value is string => value !== null)
      )
    );
  }

  cd = inject(ChangeDetectorRef);
  fetchCoinDetails(rowDetail: any) {
    if (this.coinDetailDrawerRef) {
      this.coinDetailDrawerRef.clear();
    }
    const componentRef = this.coinDetailDrawerRef.createComponent(
      CoinDetailDrawerComponent
    );
    componentRef.setInput('coinId', rowDetail.id);
    console.log('Row Detail', rowDetail);
    componentRef.instance.closed.subscribe(() => {
      this.coinDetailDrawerRef.clear();
    });
  }

  fetchCoinsCurrency(currency: string) {
    this.paginator.resetToFirstPage();
    this.paginatorStore.setPagination({
      pageIndex: 1,
      pageSize: 10,
    });
    this.store?.fetchCoins();
  }
}
