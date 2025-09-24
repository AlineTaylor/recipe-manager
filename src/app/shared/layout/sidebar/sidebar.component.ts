import { Component, computed, inject } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { ComponentType } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { AuthComponent } from '../../../auth/auth.component';
import { AuthService } from '../../utils/services/auth.service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  public authService = inject(AuthService);
  // login dialog logic
  authComponent = AuthComponent;
  isLoggedIn = computed(() => !!this.authService.tokenSignal()); //could have pulled it directly from the service, but I think it's more readable this way ¯\_(ツ)_/¯

  readonly dialog = inject(MatDialog);
  openDialog(component: ComponentType<any>) {
    this.dialog.open(component);
  }
  logout() {
    this.authService.logout();
  }
}
