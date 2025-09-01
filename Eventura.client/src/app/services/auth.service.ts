import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'https://localhost:7269/api/auth'; // ✅ keep /auth here

  constructor(private http: HttpClient) { }

  // 🟢 Register
  register(body: { name: string; email: string; password: string; confirmPassword: string }): Observable<any> {
    return this.http.post(`${this.api}/register`, body);
  }

  // 🟢 Login
  login(email: string, password: string): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`${this.api}/login`, { email, password })
      .pipe(
        tap(res => {
          if (res.accessToken) {
            localStorage.setItem('access_token', res.accessToken);
          }
        })
      );
  }

  // 🟢 Logout
  logout() {
    localStorage.removeItem('access_token');
  }

  // 🟢 Helper: Get token
  get token(): string | null {
    return localStorage.getItem('access_token');
  }

  // 🟢 Helper: Check if logged in
  get isLoggedIn(): boolean {
    return !!this.token;
  }
}
