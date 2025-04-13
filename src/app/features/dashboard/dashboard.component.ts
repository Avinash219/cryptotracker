import { Component, inject, Input } from '@angular/core';
import { filter, interval, of, startWith, switchMap } from 'rxjs';
import { CryptoApiService } from '../../core/crypto-api.service';
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
  ],
  providers: [DashboardStore, SearchStore],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  // store = inject(DashboardStore);
  searchStore = inject(SearchStore);
  searchControl = new FormControl('');

  @Input() store?: DashboardStore;

  constructor() {
    this.store ??= inject(DashboardStore); // fallback only if not passed via Storybook
  }

  coin$ = this.searchControl.valueChanges.pipe(
    startWith(''),
    switchMap(
      (searchTerm) =>
        searchTerm?.trim().length && searchTerm?.trim().length > 3
          ? this.searchStore.results$
          : this.searchStore.results$
      //    : if(this.store){this.store.coin$}
    )
  );
  loading$ = this.store?.loading$;
  error$ = this.store?.error$;

  displayedColumns = ['image', 'name', 'price', 'change'];

  ngOnInit() {
    this.searchWithParam();
  }

  refreshCoinDetails() {
    console.log('Button clicked');
    if (
      this.searchControl?.value &&
      this.searchControl?.value?.trim().length > 3
    ) {
      this.searchStore.searchEffect(of(this.searchControl.value));
    } else {
      this.store?.fetchTopCoins();
    }
  }

  onClear() {
    this.searchControl.setValue('');
    this.store?.fetchTopCoins();
  }

  searchWithParam() {
    this.searchStore.searchEffect(
      this.searchControl.valueChanges.pipe(
        filter((value): value is string => value !== null)
      )
    );
  }
}
