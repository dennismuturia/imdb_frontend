import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // ✅ Don’t attach auth header to login/logout/public endpoints
  const isPublic =
    req.url.includes('/auth/login') ||
    req.url.includes('/logout') ||
    req.url.includes('/actuator') ||
    req.method === 'OPTIONS';

  const header = auth.getAuthHeader();

  const authReq =
    !isPublic && header
      ? req.clone({ setHeaders: { Authorization: header } })
      : req;

  return next(authReq).pipe(
    tap({
      next: (event: any) => {
        if (event?.status) {
          console.log(`[HTTP OK] ${authReq.method} ${authReq.url} ->`, event.status);
        }
      }
    }),
    catchError((err: unknown) => {
      const httpErr = err as HttpErrorResponse;
      console.log(`[HTTP ERROR] ${authReq.method} ${authReq.url} ->`, httpErr.status, httpErr.message);

      if (httpErr.status === 401) {
        auth.logout();
        router.navigate(['/login']);
      }

      return throwError(() => err);
    })
  );
};
