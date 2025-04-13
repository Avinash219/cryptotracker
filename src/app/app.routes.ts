import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { WatchlistComponent } from './features/watchlist/watchlist.component';
import { ChartsComponent } from './features/charts/charts.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'watchlist', component: WatchlistComponent },
  { path: 'charts', component: ChartsComponent },
];
