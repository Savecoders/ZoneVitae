import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map, of, switchMap, catchError } from "rxjs";
import { Usuario } from "../models/usuario.model";
import { ApiResponse } from "../models/api-response.model";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/Usuario`;

  constructor(private http: HttpClient) {}

  // Get all users
  getAll(): Observable<Usuario[]> {
    return this.http.get<ApiResponse<Usuario[]>>(`${this.apiUrl}`).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(response.message || "Error obteniendo usuarios");
        }
        if (!response.data) {
          throw new Error("No data received from server");
        }
        return response.data;
      }),
      catchError((error) => {
        console.error("Error fetching users:", error);
        return of([]);
      }),
    );
  }

  // Get user by ID
  getById(id: string): Observable<Usuario> {
    return this.http.get<ApiResponse<Usuario>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(response.message || "Error obteniendo usuario");
        }
        if (!response.data) {
          throw new Error("No data received from server");
        }
        return response.data;
      }),
    );
  }

  // Create user
  create(usuario: Usuario): Observable<Usuario> {
    return this.http.post<ApiResponse<Usuario>>(`${this.apiUrl}`, usuario).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(response.message || "Error creando usuario");
        }
        if (!response.data) {
          throw new Error("No data received from server");
        }
        return response.data;
      }),
    );
  }

  // Update user
  update(id: string, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http
      .put<ApiResponse<Usuario>>(`${this.apiUrl}/${id}`, usuario)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message || "Error actualizando usuario");
          }
          if (!response.data) {
            throw new Error("No data received from server");
          }
          return response.data;
        }),
      );
  }

  // Delete user
  delete(id: string): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(response.message || "Error eliminando usuario");
        }
        return response.data || {};
      }),
    );
  }

  // Get user by exact username match
  getUserByUsername(username: string): Observable<Usuario | null> {
    return this.getAll().pipe(
      map((usuarios) => {
        const user = usuarios.find(
          (usuario) =>
            usuario.nombreUsuario.toLowerCase() === username.toLowerCase(),
        );
        return user || null;
      }),
      catchError((error) => {
        console.error("Error fetching user by username:", error);
        return of(null);
      }),
    );
  }

  // Get all users with filtering - can be improved with server-side filtering
  getUsuarios(
    nombreUsuario?: string,
    email?: string,
    genero?: string,
  ): Observable<Usuario[]> {
    // In a real API, you would add query parameters for filtering
    // For now, we'll handle filtering on the client side
    return this.getAll().pipe(
      map((usuarios) =>
        usuarios.filter(
          (usuario) =>
            (nombreUsuario
              ? usuario.nombreUsuario
                  .toLowerCase()
                  .includes(nombreUsuario.toLowerCase())
              : true) &&
            (email
              ? usuario.email.toLowerCase().includes(email.toLowerCase())
              : true) &&
            (genero ? usuario.genero === genero : true),
        ),
      ),
      catchError((error) => {
        console.error("Error fetching filtered users:", error);
        return of([]);
      }),
    );
  }

  // Update user profile with file upload
  updateProfile(userData: FormData): Observable<{
    token: string;
    usuario: Usuario;
  }> {
    return this.http
      .put<
        ApiResponse<{
          success: boolean;
          token: string;
          usuario: Usuario;
        }>
      >(`${this.apiUrl}/update-profile`, userData)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message || "Error actualizando perfil");
          }
          if (!response.data) {
            throw new Error("No data received from server");
          }
          return response.data;
        }),
      );
  }

  updateModerator(userData: FormData): Observable<Usuario> {
    const userId = userData.get("id") as string;
    if (!userId) {
      throw new Error("User ID is required for profile update");
    }

    return this.http
      .put<ApiResponse<Usuario>>(`${this.apiUrl}/${userId}`, userData)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message || "Error actualizando perfil");
          }
          if (!response.data) {
            throw new Error("No data received from server");
          }
          return response.data;
        }),
      );
  }

  // Change password
  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Observable<any> {
    return this.http
      .post<ApiResponse<any>>(`${this.apiUrl}/${userId}/change-password`, {
        currentPassword,
        newPassword,
        confirmPassword: newPassword,
      })
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message || "Error cambiando contraseña");
          }
          return response.data || {};
        }),
      );
  }

  // Get user roles
  getUserRoles(userId: string): Observable<string[]> {
    return this.http
      .get<ApiResponse<string[]>>(`${this.apiUrl}/${userId}/roles`)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message || "Error obteniendo roles");
          }
          return response.data || [];
        }),
        catchError(() => of([])),
      );
  }

  // Get user communities
  getUserCommunities(userId: string): Observable<any[]> {
    return this.http
      .get<ApiResponse<any[]>>(`${this.apiUrl}/${userId}/communities`)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message || "Error obteniendo comunidades");
          }
          return response.data || [];
        }),
        catchError(() => of([])),
      );
  }

  // Get user by username
  getUserByUsernameFromAPI(username: string): Observable<Usuario | null> {
    return this.http
      .get<ApiResponse<Usuario>>(`${this.apiUrl}/username/${username}`)
      .pipe(
        map((response) => {
          if (!response.success) {
            return null;
          }
          return response.data || null;
        }),
        catchError(() => of(null)),
      );
  }

  // Validate email availability
  validateEmail(email: string): Observable<boolean> {
    return this.http
      .post<ApiResponse<any>>(`${this.apiUrl}/validate-email`, { email })
      .pipe(
        map((response) => {
          return response.success;
        }),
        catchError((error) => {
          // If it's a 409 (Conflict), the email is already taken
          if (error.status === 409) {
            return of(false);
          }
          // For other errors, assume email is available
          return of(true);
        }),
      );
  }
}
