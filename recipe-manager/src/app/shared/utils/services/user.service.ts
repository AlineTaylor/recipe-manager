import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  user_id: number;
  first_name: string;
  email: string;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private tokenKey = 'jwt_token';

  constructor() {}

  getUser(): DecodedToken | null {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return null;

    try {
      return jwtDecode<DecodedToken>(token);
    } catch (e) {
      return null;
    }
  }

  getFirstName(): string {
    return this.getUser()?.first_name ?? '';
  }
}
