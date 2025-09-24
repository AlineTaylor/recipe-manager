import {
  HttpInterceptorFn,
  HttpRequest,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { EMPTY, Observable, throwError } from 'rxjs';
import { AuthService } from '../app/shared/utils/services/auth.service';

export const authTokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: (req: HttpRequest<unknown>) => Observable<HttpEvent<unknown>>
) => {
  const authService = inject(AuthService);
  const authToken = authService.getToken();

  const authReq = authToken
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`),
      })
    : req;

  // Troubleshooting notes: call next and catch 401 responses. If the app has already cleared local auth
  // state (user logged out), suppress 401s for safe, idempotent requests (GET/HEAD)
  // to avoid noise from in-flight or immediately-triggered requests during logout.
  return next(authReq).pipe(
    catchError((err) => {
      if (err && err.status === 401) {
        const method = (req && req.method) || 'GET';
        const userStillLoggedIn = authService.isLoggedIn();
        // If the client is already logged out and the request was non-mutating,
        // swallow the error and complete silently.
        if (!userStillLoggedIn && (method === 'GET' || method === 'HEAD')) {
          return EMPTY;
        }
      }
      return throwError(() => err);
    })
  );
};
