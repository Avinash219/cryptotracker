import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormField } from '@angular/material/select';
import { MatLabel } from '@angular/material/select';
import { CryptoApiService } from '../../core/crypto-api.service';
import {
  catchError,
  filter,
  Observable,
  of,
  startWith,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CurrencyStore } from './Currency.Store';
import { CurrencyNamePipe } from '../../shared/pipes/currency-name.pipe';

@Component({
  selector: 'app-currency-switcher-dropdown',
  imports: [
    MatSelectModule,
    MatFormField,
    MatLabel,
    AsyncPipe,
    ReactiveFormsModule,
    CurrencyNamePipe,
  ],
  templateUrl: './currency-switcher-dropdown.component.html',
  styleUrl: './currency-switcher-dropdown.component.scss',
})
export class CurrencySwitcherDropdownComponent {
  cryptoApiService = inject(CryptoApiService);
  @Output() currencySelected = new EventEmitter<string>();
  currencyStore = inject(CurrencyStore);
  fb = inject(FormBuilder);
  currencyList$: Observable<string[]> =
    this.currencyStore.supportedCurrencyList$;
  selectedCurrency = this.fb.control<string | null>(null);

  ngOnInit() {
    this.currencyStore.supportedCurrencyList$
      .pipe(
        filter((list) => list.length > 0),
        withLatestFrom(this.currencyStore.selectedCurrency$),
        take(1),
        tap(([_, cur]) =>
          this.selectedCurrency.setValue(cur, { emitEvent: false })
        ),
        switchMap(() =>
          this.selectedCurrency.valueChanges.pipe(
            startWith(this.selectedCurrency.value)
          )
        )
      )
      .subscribe((response: any) => {
        this.currencyStore.setCurrency(response);
        this.currencySelected.emit(response);
      });
  }

  trackByCurrency(_: number, currency: string) {
    return currency;
  }
}
