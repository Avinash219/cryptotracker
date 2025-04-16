import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CryptoApiService {
  private http = inject(HttpClient);
  private baseUrl = 'https://api.coingecko.com/api/v3';

  getTopCoins(): Observable<any> {
    return this.http.get(`${this.baseUrl}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
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
    return this.http
      .get(`${this.baseUrl}/search`, {
        params: { query },
      })
      .pipe(
        tap((res: any) => console.log(res)),
        map((res: any) => res?.coins.map((coin: any) => coin.id)),
        switchMap((ids) =>
          this.http.get(`${this.baseUrl}/coins/markets`, {
            params: {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: 10,
              page: 1,
              ids: ids.join(','),
            },
          })
        )
      );
  }

  getCoinDetails(coinId: string): Observable<any> {
    console.log('Coin id', coinId);
    return this.http.get(`${this.baseUrl}/coins/${coinId}`);
  }
}
