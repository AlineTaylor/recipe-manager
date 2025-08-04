import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token = signal<string | null>(localStorage.getItem('token'));
  public attemptedUrl: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, email_confirmation: string, password: string) {
    return this.http.post<{ token: string }>('http://localhost:3000/login', {
      email,
      password,
    });
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.token.set(token);
  }

  getToken() {
    return this.token();
  }

  isLoggedIn() {
    return !!this.token();
  }

  logout() {
    localStorage.removeItem('token');
    this.token.set(null);
    this.router.navigate(['/welcome']);
  }

  signUp(user: any) {
    return this.http.post('http://localhost:3000/users', user);
  }
  readonly tokenSignal = this.token.asReadonly(); // for component binding
}
