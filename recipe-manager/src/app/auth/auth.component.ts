import { Component, signal } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from '../shared/utils/services/auth.service';
import { DEMO_CONFIG } from '../shared/utils/demo.config';
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
  isSignup = signal(false);
  showPassword = signal(false);
  showPasswordConfirm = signal(false);

  email = '';
  email_confirmation = '';
  password = '';
  password_confirmation = '';
  first_name = '';
  last_name = '';
  preferred_system = '';
  demoLoginChecked = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialogRef: MatDialogRef<AuthComponent>,
    private snackBar: MatSnackBar
  ) {}

  toggleAuthForm() {
    this.isSignup.update((val) => !val);
  }

  // autofill logic for demo user
  onDemoLoginToggle(event: any) {
    if (event.checked) {
      this.email = DEMO_CONFIG.demoEmail;
      this.password = DEMO_CONFIG.demoPassword;
      // clear signup-only fields if switching back
      this.email_confirmation = '';
      this.password_confirmation = '';
      this.first_name = '';
      this.last_name = '';
      this.preferred_system = '';
      this.login();
    } else {
      this.email = '';
      this.password = '';
    }
  }

  // authentication for existing users
  login() {
    this.authService
      .login(this.email, this.email_confirmation, this.password)
      .subscribe({
        next: (res: any) => {
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
              panelClass: ['snackbar-error'],
              horizontalPosition: 'right',
              verticalPosition: 'top',
            }
          );
        },
      });
  }

  // signing up new users

  user = {
    email: '',
    email_confirmation: '',
    password: '',
    password_confirmation: '',
  };
  onSubmit() {
    if (this.password !== this.password_confirmation) {
      this.snackBar.open('Passwords do not match', 'Dismiss', {
        duration: 3000,
      });
      return;
    }

    this.authService
      .signUp({
        email: this.email,
        email_confirmation: this.email_confirmation,
        password: this.password,
        password_confirmation: this.password_confirmation,
        first_name: this.first_name,
        last_name: this.last_name,
        preferred_system: this.preferred_system,
      })
      .subscribe({
        next: (res) => {
          this.snackBar.open(
            'Account created! You can now log in.',
            'Dismiss',
            {
              duration: 3000,
            }
          );
          this.isSignup.set(false); // switch back to login view
        },
        error: (err) => {
          console.error('Signup failed', err);
          this.snackBar.open('Signup failed. Please try again.', 'Dismiss', {
            duration: 5000,
            panelClass: ['snackbar-error'],
          });
        },
      });
  }
}
