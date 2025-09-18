import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { User } from '../user.model';
import { DEMO_CONFIG } from '../demo.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token = signal<string | null>(localStorage.getItem('jwt_token'));
  private currentUser = signal<User | null>(null);
  public attemptedUrl: string | null = null;

  constructor(private http: HttpClient, private router: Router) {
    // for existing sessions (page refresh), populate user
    if (this.token()) {
      this.fetchCurrentUser();
    }
  }

  // Keep the existing signature to avoid disrupting current caller code (email_confirmation unused by API)
  login(email: string, _email_confirmation: string, password: string) {
    return this.http.post<{ token: string }>(`${environment.apiUrl}/login`, {
      email,
      password,
    });
  }

  setToken(token: string) {
    localStorage.setItem('jwt_token', token);
    this.token.set(token);
    // refresh current user details after setting new token
    this.fetchCurrentUser();
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
    this.currentUser.set(null);
    this.router.navigate(['/welcome']);
  }

  signUp(data: any) {
    return this.http.post(`${environment.apiUrl}/users`, data);
  }
  readonly tokenSignal = this.token.asReadonly(); // for component binding

  readonly currentUserSignal = this.currentUser.asReadonly();

  /**
   * Returns snapshot of current user (or null) without triggering reactive tracking.
   */
  getCurrentUser() {
    return this.currentUser();
  }

  /** Determine if currently logged in user is the demo user */
  isDemoUser() {
    return this.currentUser()?.email === DEMO_CONFIG.demoEmail;
  }

  /** Decode JWT payload to extract user_id (returns number | null) */
  private extractUserIdFromToken(token: string | null): number | null {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(
        atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
      );
      return payload.user_id || payload.userId || null;
    } catch (_e) {
      return null;
    }
  }

  /** Fetch current user details from backend using id in JWT */
  fetchCurrentUser() {
    const id = this.extractUserIdFromToken(this.token());
    if (!id) return;
    this.http.get<User>(`${environment.apiUrl}/users/${id}`).subscribe({
      next: (u) => this.currentUser.set(u),
      error: (_err) => {
        // On error (e.g., token expired server-side), clear local state gracefully
        this.currentUser.set(null);
      },
    });
  }
}
