import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://localhost:7269/api/auth';

  // 🔹 Observables for login state and username
  private loggedIn$ = new BehaviorSubject<boolean>(this.hasValidToken());
  private username$ = new BehaviorSubject<string | null>(this.getUsername());
    isLoggedIn$ = this.loggedIn$.asObservable();
  usernameObs$ = this.username$.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap(tokens => this.storeTokens(tokens)));
  }

  register(name: string, email: string, password: string, confirmPassword: string) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, { name, email, password, confirmPassword })
      .pipe(tap(tokens => this.storeTokens(tokens)));
  }

  refreshToken() {
    const refresh = localStorage.getItem('refreshToken');
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken: refresh })
      .pipe(tap(tokens => this.storeTokens(tokens)));
  }

  private storeTokens(tokens: AuthResponse) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    this.loggedIn$.next(true);
    this.username$.next(this.getUsername());
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.loggedIn$.next(false);
    this.username$.next(null);
  }

  // ✅ Decode JWT
  getDecodedToken(): any {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  // ✅ Extract username/email
  getUsername(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.name || decoded?.username || decoded?.email || null;
  }

  // ✅ Token validation
  private hasValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      if (!expiry) return true; // no expiry claim, assume valid
      const now = Math.floor(Date.now() / 1000);
      return expiry > now;
    } catch (e) {
      console.error('Invalid token:', e);
      return false;
    }
  }
isLoggedIn(): boolean {
  return this.hasValidToken();
}
  // 🔹 Expose observables

}
