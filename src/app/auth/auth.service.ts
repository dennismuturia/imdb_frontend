import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private key = 'imdb_basic_auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    const token = btoa(`${username}:${password}`);

    // Call any endpoint that requires auth (pick something cheap).
    // If you have /actuator/health as permitAll, DON'T use that.
    return this.http.get('http://localhost:8080/actors?page=0&page_size=1', {
      headers: { Authorization: `Basic ${token}` },
    }).pipe(
      tap(() => localStorage.setItem(this.key, token)),
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout() {
    localStorage.removeItem(this.key);
  }

  isLoggedIn() {
    return localStorage.getItem(this.key) !== null;
  }

  getAuthHeader() {
    const token = localStorage.getItem(this.key);
    return token ? `Basic ${token}` : null;
  }
}
