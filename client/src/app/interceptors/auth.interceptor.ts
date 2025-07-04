import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { HttpErrorResponse } from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const platformId = inject(PLATFORM_ID);
  const authService = inject(AuthService);
  const router = inject(Router);
  const isBrowser = isPlatformBrowser(platformId);

  // Skip token handling for server-side rendering
  if (!isBrowser) {
    return next(req);
  }

  // Skip authentication for login, register, and other public endpoints
  if (isPublicRequest(req.url, req.method)) {
    return next(req);
  }

  // Add authorization header with jwt token if available
  const token = authService.getToken() || "";
  if (token) {
    req = addTokenToRequest(req, token);
  }

  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Token is expired or invalid - logout and redirect to login
        authService.logout();
        router.navigate(["/auth/login"]);
      }
      return throwError(() => error);
    }),
  );
};

function addTokenToRequest(
  request: HttpRequest<unknown>,
  token: string,
): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function isPublicRequest(url: string, method: string = "GET"): boolean {
  const publicUrls = [
    "/api/Auth/login",
    "/api/Auth/signup",
    "/api/Auth/forgot-password",
    "/api/Auth/reset-password",
    "/api/Usuario/validate-email",
  ];

  // Also allow access to public endpoints for GET requests only
  const publicGetEndpoints = [
    "/api/Roles",
    "/api/Actividades",
    "/api/Comunidades",
    "/api/Reports",
  ];

  // Check if it's a public URL specific endpoint
  if (publicUrls.some((publicUrl) => url.includes(publicUrl))) {
    return true;
  }

  if (
    method === "GET" &&
    publicGetEndpoints.some((endpoint) => url.includes(endpoint))
  ) {
    return true;
  }

  return false;
}
