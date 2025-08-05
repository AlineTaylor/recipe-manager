import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  inject,
} from '@angular/core';
import { SharedModule } from '../../shared.module';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { AuthComponent } from '../../../auth/auth.component';
import { ComponentType } from '@angular/cdk/overlay';
import { AuthService } from '../../utils/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './header.component.html',
  styleUrl: '../header-footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  public authService = inject(AuthService);
  // TODO is this okay???
  @Input() drawer!: MatDrawer; // take drawer from parent

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
