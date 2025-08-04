import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FavoritesComponent } from '../favorites/favorites.component';
import { LatestComponent } from '../latest/latest.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule, FavoritesComponent, LatestComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.css',
    '../shared/layout/sidebar/sidebar.component.css',
  ],
})
export class DashboardComponent {}
