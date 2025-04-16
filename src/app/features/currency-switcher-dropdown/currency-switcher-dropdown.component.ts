import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormField } from '@angular/material/select';
import { MatLabel } from '@angular/material/select';
import { CryptoApiService } from '../../core/crypto-api.service';
import { catchError, Observable, of, tap } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
  currencyList$: Observable<string[]> = this.cryptoApiService
    .getCurrencyList()
    .pipe(
      tap((response: any) => console.log(response)),
      catchError((error) => {
        console.log(error);
        return of([]);
      })
    );
  selectedCurrency = new FormControl('');

  ngOnInit() {
    this.selectedCurrency.valueChanges.subscribe((response: any) => {
      this.currencyStore.setCurrency(response);
      this.currencySelected.emit(response);
    });
  }
}
