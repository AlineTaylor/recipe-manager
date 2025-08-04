import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from '../shared/utils/services/auth.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  email: string = '';
  email_confirmation: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialogRef: MatDialogRef<AuthComponent>,
    private snackBar: MatSnackBar
  ) {}

  login() {
    this.authService
      .login(this.email, this.email_confirmation, this.password)
      .subscribe({
        next: (res: any) => {
          console.log('Logged in with token:', res.token);
          this.authService.setToken(res.token);
          const redirect = this.authService.attemptedUrl || '/dashboard';
          this.authService.attemptedUrl = null;
          this.dialogRef.close();
          this.router.navigate([redirect]);
        },
        error: (error: any) => {
          console.error('Login error', error);
          this.snackBar.open(
            'Login failed. Please double-check your email and password and try again.',
            'Dismiss',
            {
              duration: 5000,
              panelClass: 'snackbar-error',
              horizontalPosition: 'right',
              verticalPosition: 'top',
            }
          );
        },
      });
  }
}
