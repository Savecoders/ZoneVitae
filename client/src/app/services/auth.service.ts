import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import {
  AuthRequest,
  AuthResponse,
  RegisterRequest,
  PasswordResetRequest,
  PasswordUpdateRequest,
  MockTokenInfo,
} from '../models/auth.model';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Rol } from '../models/rol.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.jsonServerUrl}`;
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenKey = 'auth_token';
  private userKey = 'user_data';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
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
          expires: userData.expires,
          user: userData.user,
        });
      } catch (error) {
        console.error('Failed to parse stored user data', error);
        this.logout();
      }
    }
  }

  // Store authentication data in localStorage
  private storeAuthData(authData: AuthResponse): void {
    if (!this.isBrowser) return;

    localStorage.setItem(this.tokenKey, authData.token);
    localStorage.setItem(
      this.userKey,
      JSON.stringify({
        expires: authData.expires,
        user: authData.user,
      })
    );
  }

  // Generate a mock token for json-server (since it doesn't use JWT)
  private generateMockToken(userId: number): string {
    const tokenInfo: MockTokenInfo = {
      userId: userId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    };
    return btoa(JSON.stringify(tokenInfo)); // Base64 encode the token info
  }

  // Get user roles from the roles endpoint
  private getUserRoles(userId: number): Observable<string[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/usuario_roles?id_usuario=${userId}`)
      .pipe(
        switchMap((userRoles) => {
          if (userRoles.length === 0) {
            return of([]);
          }

          // Get role details for each role ID
          const roleIds = userRoles.map((ur) => ur.id_rol);
          const roleRequests = roleIds.map((roleId) =>
            this.http.get<Rol>(`${this.apiUrl}/roles/${roleId}`)
          );

          return forkJoin(roleRequests).pipe(
            map((roles) => roles.map((role) => role.nombre))
          );
        }),
        catchError((error) => {
          console.error('Error fetching user roles:', error);
          return of([]);
        })
      );
  }

  // Login user
  login(credentials: AuthRequest): Observable<AuthResponse> {
    // First, check if the user exists with the provided email
    return this.http
      .get<any[]>(`${this.apiUrl}/usuarios?email=${credentials.email}`)
      .pipe(
        switchMap((users) => {
          if (users.length === 0) {
            return throwError(
              () => new Error('User not found with this email')
            );
          }

          const user = users[0];

          // Validate password (in a real app, this would be done on the server with hashed passwords)
          if (user.password !== credentials.password) {
            return throwError(() => new Error('Invalid password'));
          }

          // Get user roles
          return this.getUserRoles(user.id).pipe(
            map((roles) => {
              // Generate mock token
              const token = this.generateMockToken(user.id);
              const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

              // Create auth response
              const authResponse: AuthResponse = {
                token: token,
                expires: expiresAt.toISOString(),
                user: {
                  id: user.id,
                  nombre_usuario: user.nombre_usuario,
                  email: user.email,
                  foto_perfil: user.foto_perfil,
                  roles: roles,
                },
              };

              return authResponse;
            })
          );
        }),
        tap((response) => {
          this.storeAuthData(response);
          this.currentUserSubject.next(response);
        }),
        catchError((error) => {
          return throwError(() => new Error(error.message || 'Login failed'));
        })
      );
  }

  // Register new user
  register(userData: RegisterRequest): Observable<AuthResponse> {
    // First, check if the email already exists
    return this.http
      .get<any[]>(`${this.apiUrl}/usuarios?email=${userData.email}`)
      .pipe(
        switchMap((users) => {
          if (users.length > 0) {
            return throwError(() => new Error('Email already in use'));
          }

          // Create new user without confirmPassword
          const { confirmPassword, ...newUser } = userData;

          // Add creation timestamp
          const userToCreate = {
            ...newUser,
            estado_cuenta: 'Activo',
            create_at: new Date().toISOString(),
            update_at: new Date().toISOString(),
          };

          // Create user
          return this.http
            .post<any>(`${this.apiUrl}/usuarios`, userToCreate)
            .pipe(
              switchMap((createdUser) => {
                // Assign default user role (assuming role ID 2 is "user")
                return this.http
                  .post(`${this.apiUrl}/usuario_roles`, {
                    id_usuario: createdUser.id,
                    id_rol: 2, // Assuming 2 is the regular user role ID
                  })
                  .pipe(map(() => createdUser));
              }),
              switchMap((createdUser) => {
                // Get user roles
                return this.getUserRoles(createdUser.id).pipe(
                  map((roles) => {
                    // Generate mock token
                    const token = this.generateMockToken(createdUser.id);
                    const expiresAt = new Date(
                      Date.now() + 24 * 60 * 60 * 1000
                    ); // 24 hours from now

                    // Create auth response
                    const authResponse: AuthResponse = {
                      token: token,
                      expires: expiresAt.toISOString(),
                      user: {
                        id: createdUser.id,
                        nombre_usuario: createdUser.nombre_usuario,
                        email: createdUser.email,
                        foto_perfil: createdUser.foto_perfil,
                        roles: roles,
                      },
                    };

                    return authResponse;
                  })
                );
              })
            );
        }),
        tap((response) => {
          this.storeAuthData(response);
          this.currentUserSubject.next(response);
        }),
        catchError((error) => {
          return throwError(
            () => new Error(error.message || 'Registration failed')
          );
        })
      );
  }

  // Logout user
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
    this.currentUserSubject.next(null);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value?.token;
  }

  // Get current user
  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  // Get auth token
  getToken(): string | null {
    return this.currentUserSubject.value?.token || null;
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    // Get token
    const token = this.getToken();
    if (!token) return true;

    try {
      // Decode the token (base64)
      const tokenInfo: MockTokenInfo = JSON.parse(atob(token));
      const expirationDate = new Date(tokenInfo.expiresAt);
      return expirationDate < new Date();
    } catch (error) {
      console.error('Error parsing token', error);
      return true;
    }
  }

  // Get user ID from token
  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const tokenInfo: MockTokenInfo = JSON.parse(atob(token));
      return tokenInfo.userId;
    } catch {
      return null;
    }
  }

  // Request password reset
  requestPasswordReset(email: PasswordResetRequest): Observable<any> {
    // With json-server, we'll simulate this by checking if the user exists
    return this.http
      .get<any[]>(`${this.apiUrl}/usuarios?email=${email.email}`)
      .pipe(
        map((users) => {
          if (users.length === 0) {
            throw new Error('No user found with this email');
          }

          // In a real app, this would send an email with a reset link
          // For now, we'll just return a success message
          return { message: 'Password reset instructions sent to your email' };
        }),
        catchError((error) => {
          return throwError(
            () => new Error(error.message || 'Password reset request failed')
          );
        })
      );
  }

  // Update password with reset token
  updatePassword(data: PasswordUpdateRequest): Observable<any> {
    // In a real app, this would verify the token and update the password
    // For json-server, we'll simulate this by finding the user in "users" from the token

    try {
      // Decode the token to get the user ID
      const tokenInfo: MockTokenInfo = JSON.parse(atob(data.token));
      const userId = tokenInfo.userId;

      // Verify the token is not expired
      const expirationDate = new Date(tokenInfo.expiresAt);
      if (expirationDate < new Date()) {
        return throwError(() => new Error('Password reset token has expired'));
      }

      // Check that passwords match
      if (data.password !== data.confirmPassword) {
        return throwError(() => new Error('Passwords do not match'));
      }

      // Update the user's password
      return this.http
        .patch<any>(`${this.apiUrl}/usuarios/${userId}`, {
          password: data.password,
          update_at: new Date().toISOString(),
        })
        .pipe(
          map(() => {
            return { message: 'Password updated successfully' };
          })
        );
    } catch (error) {
      return throwError(() => new Error('Invalid password reset token'));
    }
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    const userRoles = this.currentUserSubject.value?.user.roles || [];
    return userRoles.includes(role);
  }
}
