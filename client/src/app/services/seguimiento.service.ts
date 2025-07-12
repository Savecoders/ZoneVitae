import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { SeguimientoReporte } from '../models/seguimiento-reporte.model';
import {Reporte} from '../models/reporte.model';
import { Comunidad } from 'app/models';
import { ApiResponse } from 'app/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SeguimientoService  {
  private apiUrl = `${environment.apiUrl}/SeguimientoReporte`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<SeguimientoReporte[]> {
    return this.http.get<ApiResponse<SeguimientoReporte[]>>(this.apiUrl).pipe(
      map(response => response.data ?? [])
    );
  }

  getById(id: number): Observable<SeguimientoReporte> {
    return this.http.get<ApiResponse<SeguimientoReporte>>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (!response.data) throw new Error('SeguimientoReporte not found');
        return response.data;
      })
    );
  }

  create(seguimiento: SeguimientoReporte): Observable<SeguimientoReporte> {
    return this.http.post<ApiResponse<SeguimientoReporte>>(this.apiUrl, seguimiento).pipe(
      map(response => {
        if (!response.data) throw new Error('Error creating SeguimientoReporte');
        return response.data;
      })
    );
  }

  update(id: number, seguimiento: Partial<SeguimientoReporte>): Observable<SeguimientoReporte> {
    return this.http.put<ApiResponse<SeguimientoReporte>>(`${this.apiUrl}/${id}`, seguimiento).pipe(
      map(response => {
        if (!response.data) throw new Error('Error updating SeguimientoReporte');
        return response.data;
      })
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

  getSeguimientosByReporte(reporteId: number): Observable<SeguimientoReporte[]> {
    return this.getAll().pipe(
      map(seguimientos => seguimientos.filter(s => Number(s.reporte_id) === Number(reporteId)))
    );
  }

  getSeguimientosByUsuario(usuarioId: number): Observable<SeguimientoReporte[]> {
    return this.getAll().pipe(
      map(seguimientos => seguimientos.filter(s => s.usuario_id === usuarioId))
    );
  }
  getAllComunidades(): Observable<Comunidad[]> {
    return this.http.get<ApiResponse<Comunidad[]>>(`${environment.apiUrl}/Comunidades`).pipe(
      map(response => response.data ?? [])
    );
  }
}