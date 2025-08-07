import { Component, inject, OnInit, signal, effect } from '@angular/core';
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
export class DashboardComponent implements OnInit {
  private userService = inject(UserService);
  firstName = signal('');

  // watching the get use signal for changes!
  effect = effect(() => {
    const user = this.userService.getUserSignal()();
    if (user) this.firstName.set(user.first_name);
  });

  ngOnInit(): void {
    this.userService.loadUser();
  }
}
