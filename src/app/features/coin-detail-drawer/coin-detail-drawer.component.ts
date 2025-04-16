import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  AnimationEvent,
} from '@angular/animations';
import { CryptoApiService } from '../../core/crypto-api.service';
import {
  BehaviorSubject,
  catchError,
  finalize,
  Observable,
  of,
  startWith,
  tap,
} from 'rxjs';

interface CoinDetail {
  image: { large: string };
  name: string;
  symbol: string;
  market_cap_rank: number;
  market_data: {
    current_price: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
  };
  links: { homepage: string[] };
  description: { en: string };
}

@Component({
  selector: 'app-coin-detail-drawer',
  imports: [MatSidenavModule, CommonModule],
  templateUrl: './coin-detail-drawer.component.html',
  styleUrl: './coin-detail-drawer.component.scss',
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(0%)', opacity: 1 })),
      state('out', style({ transform: 'translateX(100%)', opacity: 0 })),
      transition('out => in', animate('300ms ease-out')),
      transition('in => out', animate('300ms ease-in')),
    ]),
  ],
})
export class CoinDetailDrawerComponent {
  cryptoService = inject(CryptoApiService);
  @Input() coinId!: string;
  @Output() closed = new EventEmitter();
  visibleState: 'in' | 'out' = 'in';
  loading$ = signal(false);
  error$ = signal(null);
  coinDetails$: Observable<CoinDetail | null> = of(null);

  constructor(private cdr: ChangeDetectorRef) {}

  onBackdropClick() {
    this.visibleState = 'out';
  }

  ngOnChanges(change: SimpleChanges) {
    console.log('ngOnChanges triggered with:', this.coinId);
    if (this.coinId) {
      this.error$.set(null);
      this.loading$.set(true);
      this.coinDetails$ = this.cryptoService.getCoinDetails(this.coinId).pipe(
        catchError(() => {
          this.loading$.set(false);
          return of(null);
        }),
        tap((response) => console.log('API Response', response)),
        finalize(() => this.loading$.set(false))
      );
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.visibleState = 'in';
      this.cdr.detectChanges();
    });
  }

  onAnimationDone(event: AnimationEvent) {
    if (event.toState === 'out') {
      this.closed.emit(); // 👈 emit only when slide-out completes
    }
  }
}
