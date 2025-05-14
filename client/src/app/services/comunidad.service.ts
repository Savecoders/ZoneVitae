import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, of } from 'rxjs';
import { BaseService } from './base.service';
import { Comunidad } from '../models/comunidad.model';

@Injectable({
  providedIn: 'root',
})
export class ComunidadService extends BaseService<Comunidad> {
  constructor(http: HttpClient) {
    super(http, 'comunidades');
  }

  // Get all communities with optional filtering
  getComunidades(nombre?: string, ubicacion?: string): Observable<Comunidad[]> {
    return this.getAll().pipe(
      map((comunidades) =>
        comunidades.filter(
          (comunidad) =>
            (nombre
              ? comunidad.nombre.toLowerCase().includes(nombre.toLowerCase())
              : true) &&
            (ubicacion
              ? comunidad.ubicacion
                  .toLowerCase()
                  .includes(ubicacion.toLowerCase())
              : true)
        )
      )
    );
  }

  // Get community by ID
  getComunidadById(id: number): Observable<Comunidad> {
    return this.getById(id);
  }

  // Create a new community
  createComunidad(comunidad: Comunidad): Observable<Comunidad> {
    return this.create(comunidad);
  }

  // Update community
  updateComunidad(
    id: number,
    comunidad: Partial<Comunidad>
  ): Observable<Comunidad> {
    return this.update(id, comunidad);
  }

  // Delete community
  deleteComunidad(id: number): Observable<void> {
    return this.delete(id);
  }

  // Get communities by tag
  getComunidadesByTag(tagId: number): Observable<Comunidad[]> {
    // First get the community-tag relations
    return this.http
      .get<any[]>(
        `${this.baseUrl.replace(
          '/comunidades',
          ''
        )}/comunidad_tags?tag_id=${tagId}`
      )
      .pipe(
        map((relations) => relations.map((relation) => relation.comunidad_id)),
        switchMap((communityIds) => {
          if (communityIds.length === 0) {
            return of([]);
          }
          // Construct query params for multiple IDs
          const queryParams = communityIds.map((id) => `id=${id}`).join('&');
          return this.http.get<Comunidad[]>(`${this.baseUrl}?${queryParams}`);
        })
      );
  }
}
