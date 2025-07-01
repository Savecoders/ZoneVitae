import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map, of, switchMap, catchError } from "rxjs";
import { Usuario } from "../models/usuario.model";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}api/Usuario`;

  constructor(private http: HttpClient) {}

  // Get all users
  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}`);
  }

  // Get user by ID
  getById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  // Create user
  create(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}`, usuario);
  }

  // Update user
  update(id: string, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  // Delete user
  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
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
  updateProfile(userData: FormData): Observable<Usuario> {
    const userId = userData.get("id") as string;
    if (!userId) {
      throw new Error("User ID is required for profile update");
    }

    return this.http.put<Usuario>(`${this.apiUrl}/${userId}`, userData);
  }

  // Change password
  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${userId}/change-password`, {
      currentPassword,
      newPassword,
    });
  }

  // Get user roles
  getUserRoles(userId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${userId}/roles`);
  }

  // Get user communities
  getUserCommunities(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}/communities`);
  }
}
