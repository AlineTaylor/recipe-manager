import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from '../shared/utils/services/auth.service';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService
      .login(this.email, this.email_confirmation, this.password)
      .subscribe({
        next: (res: any) => {
          console.log('Logged in with token:', res.token);
          this.authService.setToken(res.token);
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          console.error('Login error', error);
        },
      });
  }
}
