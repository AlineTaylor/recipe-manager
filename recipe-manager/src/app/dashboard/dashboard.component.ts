import { Component, inject } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FavoritesComponent } from '../favorites/favorites.component';
import { LatestComponent } from '../latest/latest.component';
import { UserService } from '../shared/utils/services/user.service';
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
export class DashboardComponent {
  userService = inject(UserService);
  firstName = this.userService.getFirstName();
}
