import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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


  // Get all communities
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
        console.error("Error fetching communities:", error);
        return of([]);
      }),
    );
  }

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

  // Create community
  create(communityData: FormData): Observable<Comunidad> {
    return this.http.post<ApiResponse<Comunidad>>(`${this.apiUrl}`, communityData).pipe(
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

  // Update Community
  update(id: string, formData: FormData): Observable<Comunidad> {
    return this.http
      .put<ApiResponse<Comunidad>>(`${this.apiUrl}/${id}`, formData)
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


  // Delete community
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

  // Search by name
  search(name?:string):Observable<any>{
    let parametros = new HttpParams();
    if(name){
      parametros = parametros.set('nombre', name);
    }
    return this.http.get(`${this.apiUrl}/search`, {params: parametros});
   }

  // Search by creator
  getCommunitiesByCreador(): Observable<Comunidad[]> {
  return this.http.get<ApiResponse<Comunidad[]>>(`${this.apiUrl}/searchCreator`)
    .pipe(
      map(response => response.data ?? [])
    );
  }


getComunidadesParaReportes(): Observable<Comunidad[]> {
  const url = `${environment.apiUrl}/reports/comunidades`;
  return this.http.get<{ message: string, data: Comunidad[] }>(url).pipe(
    map(response => response.data)
  );
}

}

