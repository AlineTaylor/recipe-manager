import { inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { User } from '../user.model';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

interface DecodedToken {
  user_id: number;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private user = signal<User | null>(null);

  getDecodedToken(): DecodedToken | null {
    const token = this.authService.getToken();
    if (!token) return null;

    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  }

  // load and expose user data

  loadUser(): void {
    const decoded = this.getDecodedToken();
    if (!decoded?.user_id) return;

    this.http
      .get<User>(`${environment.apiUrl}/users/${decoded.user_id}`)
      .subscribe({
        next: (userData) => this.user.set(userData),
        error: (err) => console.error('Error fetching user:', err),
      });
  }

  editUser(data: any) {
    const decoded = this.getDecodedToken();
    if (!decoded?.user_id) throw new Error('No user ID found');
    return this.http.patch(
      `${environment.apiUrl}/users/${decoded.user_id}`,
      data
    );
  }

  deleteUser(currentUser: User) {
    const decoded = this.getDecodedToken();
    if (!decoded?.user_id) throw new Error('No user ID found');
    return this.http.delete(`${environment.apiUrl}/users/${decoded.user_id}`);
  }

  getUserSignal() {
    return this.user.asReadonly();
  }
}
