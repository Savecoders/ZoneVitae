import { Injectable, PLATFORM_ID, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import {
  AuthRequest,
  AuthResponse,
  RegisterRequest,
  PasswordResetRequest,
  PasswordUpdateRequest,
  AuthResponseDto,
} from "../models/auth.model";
import { ApiResponse } from "../models/api-response.model";
import { environment } from "../../environments/environment";
import { isPlatformBrowser } from "@angular/common";
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenKey = "auth_token";
  private userKey = "user_data";
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.loadStoredAuth();
    }
  }

  private loadStoredAuth(): void {
    if (!this.isBrowser) return;

    const storedToken = localStorage.getItem(this.tokenKey);
    const storedUser = localStorage.getItem(this.userKey);

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        this.currentUserSubject.next({
          token: storedToken,
          usuario: userData.usuario,
        });
      } catch (error) {
        this.logout();
      }
    }
  }

  private storeAuthData(authData: AuthResponse): void {
    if (!this.isBrowser) return;

    localStorage.setItem(this.tokenKey, authData.token);
    localStorage.setItem(
      this.userKey,
      JSON.stringify({
        usuario: authData.usuario,
      }),
    );
  }

  private getTokenExpirationDate(token: string): Date | null {
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.exp === undefined) return null;

      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);
      return date;
    } catch (error) {
      console.error("Error decoding token", error);
      return null;
    }
  }

  private extractRolesFromToken(token: string): string[] {
    try {
      const decoded: any = jwtDecode(token);
      // Check if there's a role claim in the token
      if (decoded.role) {
        // Handle comma-separated roles as returned by the API
        if (typeof decoded.role === "string") {
          return decoded.role
            .split(",")
            .map((role: string) => role.trim())
            .filter((role: string) => role);
        }
        // Handle array of roles
        return Array.isArray(decoded.role) ? decoded.role : [decoded.role];
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  private getUserIdFromToken(token: string): string | null {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.nameid || decoded.sub || null;
    } catch {
      return null;
    }
  }

  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http
      .post<ApiResponse<AuthResponseDto>>(`${this.apiUrl}/Auth/login`, {
        email: credentials.email,
        password: credentials.password,
      })
      .pipe(
        map((response) => {
          // Handle ApiResponse wrapper format
          if (!response.success) {
            throw new Error(response.message || "Login failed");
          }

          if (!response.data) {
            throw new Error("No data received from server");
          }

          const authData = response.data;
          const roles = this.extractRolesFromToken(authData.token);
          const userId = this.getUserIdFromToken(authData.token);

          const authResponse: AuthResponse = {
            token: authData.token,
            usuario: {
              id: userId || authData.usuario.id,
              nombreUsuario: authData.usuario.nombreUsuario,
              email: authData.usuario.email,
              genero: authData.usuario.genero,
              fechaNacimiento: authData.usuario.fechaNacimiento,
              fotoPerfil: authData.usuario.fotoPerfil,
              estadoCuenta: authData.usuario.estadoCuenta,
              roles: roles,
            },
          };

          return authResponse;
        }),
        tap((response) => {
          this.storeAuthData(response);
          this.currentUserSubject.next(response);
        }),
        catchError((error) => {
          return throwError(
            () => new Error(error.error?.message || "Login failed"),
          );
        }),
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("nombreUsuario", userData.nombreUsuario);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("genero", userData.genero || "No especificado");

    // Format the date as required by the API (YYYY-MM-DD)
    if (userData.fechaNacimiento) {
      const date = new Date(userData.fechaNacimiento);
      const formattedDate = date.toISOString().split("T")[0];
      formData.append("fechaNacimiento", formattedDate);
    }

    // Add the image if it exists
    if (userData.fotoPerfil) {
      formData.append("fotoPerfil", userData.fotoPerfil);
    }

    // Debug: Log FormData contents
    console.log("FormData being sent:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    return this.http
      .post<
        ApiResponse<AuthResponseDto>
      >(`${this.apiUrl}/Auth/signup`, formData)
      .pipe(
        map((response) => {
          // Handle ApiResponse wrapper format
          if (!response.success) {
            throw new Error(response.message || "Registration failed");
          }

          if (!response.data) {
            throw new Error("No data received from server");
          }

          const authData = response.data;
          const roles = this.extractRolesFromToken(authData.token);
          const userId = this.getUserIdFromToken(authData.token);

          const authResponse: AuthResponse = {
            token: authData.token,
            usuario: {
              id: userId || authData.usuario.id,
              nombreUsuario: authData.usuario.nombreUsuario,
              email: authData.usuario.email,
              genero: authData.usuario.genero,
              fechaNacimiento: authData.usuario.fechaNacimiento,
              fotoPerfil: authData.usuario.fotoPerfil,
              estadoCuenta: authData.usuario.estadoCuenta,
              roles: roles,
            },
          };

          return authResponse;
        }),
        tap((response) => {
          this.storeAuthData(response);
          this.currentUserSubject.next(response);
        }),
        catchError((error) => {
          return throwError(
            () => new Error(error.error?.message || "Registration failed"),
          );
        }),
      );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value?.token;
  }

  updateUserData(data: { token: string; usuario: any }): void {
    if (!this.currentUserSubject.value) {
      return;
    }

    const updatedAuth: AuthResponse = {
      token: data.token,
      usuario: data.usuario,
    };

    // Actualiza el observable
    this.currentUserSubject.next(updatedAuth);

    // Actualiza en localStorage
    if (this.isBrowser) {
      localStorage.setItem(this.tokenKey, data.token);
      localStorage.setItem(
        this.userKey,
        JSON.stringify({ usuario: data.usuario }),
      );
    }
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const expirationDate = this.getTokenExpirationDate(token);
    if (!expirationDate) return true;

    return expirationDate < new Date();
  }

  getUserIdFromCurrentToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    return this.getUserIdFromToken(token);
  }
  // this funcion is no abiab
  // requestPasswordReset(email: PasswordResetRequest): Observable<any> {
  //   return this.http
  //     .post<any>(`${this.apiUrl}/Auth/forgot-password`, { email: email.email })
  //     .pipe(
  //       catchError((error) => {
  //         return throwError(
  //           () =>
  //             new Error(
  //               error.error?.message || "Password reset request failed",
  //             ),
  //         );
  //       }),
  //     );
  // }

  updatePassword(data: PasswordUpdateRequest): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/Auth/reset-password`, {
        token: data.token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error(error.error?.message || "Password update failed"),
          );
        }),
      );
  }

  hasRole(role: string): boolean {
    const userRoles = this.currentUserSubject.value?.usuario.roles || [];
    return userRoles.includes(role);
  }
}
