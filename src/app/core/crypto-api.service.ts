import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap, tap, withLatestFrom } from 'rxjs';
import { PaginatorStore } from '../shared/paginator/paginator.store';

@Injectable({
  providedIn: 'root',
})
export class CryptoApiService {
  private http = inject(HttpClient);
  private baseUrl = 'https://api.coingecko.com/api/v3';

  getTopCoins(
    currency = 'usd',
    { pageIndex, pageSize }: { pageIndex: number; pageSize: number }
  ): Observable<any> {
    return this.http.get(`${this.baseUrl}/coins/markets`, {
      params: {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: pageSize,
        page: pageIndex,
      },
    });
  }

  getCoinHistory(id: string, days: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/coins/${id}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days,
      },
    });
  }

  getCoinsBySearch(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/search`, {
      params: { query },
    });
  }

  getCoinSearchById(
    ids: any,
    { pageIndex, pageSize }: { pageIndex: number; pageSize: number }
  ): Observable<any> {
    return this.http.get(`${this.baseUrl}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: pageSize,
        page: pageIndex,
        ids: ids.join(','),
      },
    });
  }

  getCoinDetails(coinId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/coins/${coinId}`);
  }

  getCurrencyList(): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.baseUrl}/simple/supported_vs_currencies`
    );
  }

  getAllCoinList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/coins/list`);
  }
}
