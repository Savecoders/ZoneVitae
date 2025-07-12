import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, of } from 'rxjs';
import { BaseService } from './base.service';
import { Comunidad } from '../models/comunidad.model';
import { environment } from 'environments/environment';

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

  // Get community by id
  getComunidadById(id: number | string): Observable<Comunidad> {
    return this.getById(id);
  }

  // Create a new community
  createComunidad(comunidad: Comunidad): Observable<Comunidad> {
    return this.create(comunidad);
  }

  // Update community
  updateComunidad(
    id: number | string,
    comunidad: Partial<Comunidad>
  ): Observable<Comunidad> {
    return this.update(id, comunidad);
  }

  // Delete community
  deleteComunidad(id: number | string): Observable<void> {
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

getComunidadesParaReportes(): Observable<Comunidad[]> {
  const url = `${environment.apiUrl}/reports/comunidades`;
  return this.http.get<{ message: string, data: Comunidad[] }>(url).pipe(
    map(response => response.data)
  );
}
}

