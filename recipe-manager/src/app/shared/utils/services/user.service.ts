import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  user_id: number;
  exp: number;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  preferred_system: string;
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
    console.log(this.getUser()?.first_name);
    return this.getUser()?.first_name ?? '';
  }
}
