import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token = signal<string | null>(localStorage.getItem('jwt_token'));
  public attemptedUrl: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, email_confirmation: string, password: string) {
    return this.http.post<{ token: string }>(`${environment.apiUrl}/login`, {
      email,
      password,
    });
  }

  setToken(token: string) {
    localStorage.setItem('jwt_token', token);
    this.token.set(token);
  }

  getToken() {
    return this.token();
  }

  isLoggedIn() {
    return !!this.token();
  }

  logout() {
    localStorage.removeItem('jwt_token');
    this.token.set(null);
    this.router.navigate(['/welcome']);
  }

  signUp(data: any) {
    return this.http.post(`${environment.apiUrl}/users`, data);
  }
  readonly tokenSignal = this.token.asReadonly(); // for component binding
}
