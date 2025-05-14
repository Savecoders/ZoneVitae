import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, switchMap } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService extends BaseService<Usuario> {
  constructor(http: HttpClient) {
    super(http, 'usuarios');
  }

  // Get all users with filtering
  getUsuarios(
    nombreUsuario?: string,
    email?: string,
    genero?: string
  ): Observable<Usuario[]> {
    return this.getAll().pipe(
      map((usuarios) =>
        usuarios.filter(
          (usuario) =>
            (nombreUsuario
              ? usuario.nombre_usuario
                  .toLowerCase()
                  .includes(nombreUsuario.toLowerCase())
              : true) &&
            (email
              ? usuario.email.toLowerCase().includes(email.toLowerCase())
              : true) &&
            (genero ? usuario.genero === genero : true)
        )
      )
    );
  }

  // For mock profile data since JSON Server doesn't support custom endpoints
  getProfile(): Observable<Usuario | null> {
    // Get first user as mock profile
    return this.getAll().pipe(
      map((usuarios) => (usuarios.length > 0 ? usuarios[0] : null))
    );
  }

  // Update user profile
  updateProfile(userData: Partial<Usuario>): Observable<Usuario> {
    // Assuming the first user is the logged-in user for mocking purposes
    return this.getProfile().pipe(
      switchMap((profile) => {
        if (profile) {
          return this.update(profile.ID!, userData);
        }
        throw new Error('No profile found');
      })
    );
  }

  // Get user communities using the relationship data
  getUserCommunities(userId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl.replace(
        '/usuarios',
        ''
      )}/usuarios_comunidades_roles?usuario_id=${userId}`
    );
  }
}
