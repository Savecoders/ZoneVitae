import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BaseService } from './base.service';
import { SeguimientoReporte } from '../models/seguimiento-reporte.model';
import { ApiResponse } from 'app/models';
import { environment } from '../../environments/environment';// Asegúrate de tener esta importación

@Injectable({
  providedIn: 'root',
})
export class SeguimientoService extends BaseService<SeguimientoReporte> {
  private jsonUrl: string = `${environment.jsonServerUrl}seguimiento_reportes`;

  constructor(http: HttpClient) {
    super(http, 'seguimiento_reportes');
  }

  // Obtener todos los seguimientos
  /*getSeguimientos(): Observable<SeguimientoReporte[]> {
    return this.getAll();
  }

    

  // Obtener seguimiento por ID
  getSeguimientoById(id: number): Observable<SeguimientoReporte> {
    return this.getById(id);
  }

  // Crear un nuevo seguimiento
  createSeguimiento(seguimiento: SeguimientoReporte): Observable<SeguimientoReporte> {
    return this.create(seguimiento);
  }

  // Actualizar seguimiento
  updateSeguimiento(id: number, seguimiento: Partial<SeguimientoReporte>): Observable<SeguimientoReporte> {
    return this.update(id, seguimiento);
  }

  // Obtener seguimientos por reporte
  getSeguimientosByReporte(reporteId: number): Observable<SeguimientoReporte[]> {
    return this.getAll().pipe(
      map((seguimientos) => seguimientos.filter(s => Number(s.reporte_id) === Number(reporteId)))
    );
  }

  // Obtener seguimientos por usuario
  getSeguimientosByUsuario(usuarioId: number): Observable<SeguimientoReporte[]> {
    return this.getAll().pipe(
      map((seguimientos) => seguimientos.filter(s => s.usuario_id === usuarioId))
    );
  }*/

    getSeguimientos(): Observable<SeguimientoReporte[]> {
    return this.http.get<ApiResponse<SeguimientoReporte[]>>(`${this.jsonUrl}`).pipe(
      map(response => response.data ?? [])
    );
  }

   getSeguimientoById(id: number): Observable<SeguimientoReporte> {
   return this.http.get<ApiResponse<SeguimientoReporte>>(`${this.jsonUrl}/${id}`).pipe(
      map(response => {
        if (response.data === undefined || response.data === null) {
          throw new Error('SeguimientoReporte not found');
        }
        return response.data;
      })
    );
  }
  
  createSeguimiento(seguimiento: SeguimientoReporte): Observable<SeguimientoReporte> {
    return this.http.post<ApiResponse<SeguimientoReporte>>(this.jsonUrl, seguimiento).pipe(
      map(response => {
        if (response.data === undefined || response.data === null) {
          throw new Error('Error creating SeguimientoReporte');
        }
        return response.data;
      })
    );
  }
  
  updateSeguimiento(id: number, seguimiento: Partial<SeguimientoReporte>): Observable<SeguimientoReporte> {
    return this.http.put<ApiResponse<SeguimientoReporte>>(`${this.jsonUrl}/${id}`, seguimiento).pipe(
      map(response => {
        if (response.data === undefined || response.data === null) {
          throw new Error('Error updating SeguimientoReporte');
        }
        return response.data;
      })
    );
  }

getSeguimientosByReporte(reporteId: number): Observable<SeguimientoReporte[]> {
  return this.http.get<ApiResponse<SeguimientoReporte[]>>(this.jsonUrl).pipe(
    map(response => (response.data ?? []).filter(s => Number(s.reporte_id) === Number(reporteId)))
  );
}

getSeguimientosByUsuario(usuarioId: number): Observable<SeguimientoReporte[]> {
  return this.http.get<ApiResponse<SeguimientoReporte[]>>(this.jsonUrl).pipe(
    map(response => (response.data ?? []).filter(s => s.usuario_id === usuarioId))
  );
}
}