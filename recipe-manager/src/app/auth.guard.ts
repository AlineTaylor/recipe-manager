import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './shared/utils/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthComponent } from './auth/auth.component';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const dialog = inject(MatDialog);

  const isLoggedIn = !!authService.tokenSignal();

  // split the rerouting logic so that the user still s redirected upon logout, and a logged out user will be prompted to log in when interacting with restricted features - killer ¯\_( ͡° ͜ʖ ͡°)_/¯
  if (state.url === '/welcome') return true;

  if (!isLoggedIn) {
    authService.attemptedUrl = state.url;
    dialog.open(AuthComponent);
    return false;
  }
  return true;
};
