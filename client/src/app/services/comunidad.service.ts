import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, of, catchError } from 'rxjs';
import { Comunidad } from '../models/comunidad.model';
import { ApiResponse } from "../models/api-response.model";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class ComunidadService{
  private apiUrl = `${environment.apiUrl}/Comunidades`;
  
  constructor(private http: HttpClient) {}

  /*
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
    */

  getAll(): Observable<Comunidad[]> {
    return this.http.get<ApiResponse<Comunidad[]>>(`${this.apiUrl}`).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(response.message || "Error obteniendo comunidades");
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

  /* Get community by id
  getComunidadById(id: number | string): Observable<Comunidad> {
    return this.getById(id);
  }
*/
   // Get community by ID
  getById(id: string): Observable<Comunidad> {
    return this.http.get<ApiResponse<Comunidad>>(`${this.apiUrl}/${id}`).pipe(
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


  /* Create a new community
  createComunidad(comunidad: Comunidad): Observable<Comunidad> {
    return this.create(comunidad);
  }
  */

    create(community:Comunidad): Observable<Comunidad> {
      return this.http.post<ApiResponse<Comunidad>>(`${this.apiUrl}`, community).pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message || "Error creando comunidad");
          }
          if (!response.data) {
            throw new Error("No data received from server");
          }
          return response.data;
        }),
      );
    }

  /* Update community
  updateComunidad(
    id: number | string,
    comunidad: Partial<Comunidad>
  ): Observable<Comunidad> {
    return this.update(id, comunidad);
  }
    */

  update(id: string, community: Partial<Comunidad>): Observable<Comunidad> {
    return this.http
      .put<ApiResponse<Comunidad>>(`${this.apiUrl}/${id}`, community)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message || "Error actualizando comunidad");
          }
          if (!response.data) {
            throw new Error("No data received from server");
          }
          return response.data;
        }),
      );
  }


  /* Delete community
  deleteComunidad(id: number | string): Observable<void> {
    return this.delete(id);
  }
    */

  delete(id: string): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(response.message || "Ha ocurrido un error al eliminar la comunidad");
        }
        return response.data || {};
      }),
    );
  }

  getCommunitiesByName(name: string): Observable<Comunidad[]> {
    return this.getAll().pipe(
      map((comunidades) => {
        return comunidades.filter(
          (comunidad) =>
            comunidad.nombre.toLowerCase().includes(name.toLowerCase())
        );
      }),
      catchError((error) => {
        console.error("Error fetching communities by name:", error);
        return of([]);
      }),
    );
  }

  

  /* Get communities by tag
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
      */
}