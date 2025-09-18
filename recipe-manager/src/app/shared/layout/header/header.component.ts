import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { SharedModule } from '../../shared.module';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { AuthComponent } from '../../../auth/auth.component';
import { ComponentType } from '@angular/cdk/overlay';
import { AuthService } from '../../utils/services/auth.service';
import { UserService } from '../../utils/services/user.service';

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
  private userService = inject(UserService);

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

  // user greeting
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
