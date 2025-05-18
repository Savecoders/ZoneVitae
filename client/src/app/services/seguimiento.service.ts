import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BaseService } from './base.service';
import { SeguimientoReporte } from '../models/seguimiento-reporte.model';

@Injectable({
  providedIn: 'root',
})
export class SeguimientoService extends BaseService<SeguimientoReporte> {
  constructor(http: HttpClient) {
    super(http, 'seguimiento_reportes');
  }

  // Obtener todos los seguimientos
  getSeguimientos(): Observable<SeguimientoReporte[]> {
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
  updateSeguimiento(id: string, seguimiento: Partial<SeguimientoReporte>): Observable<SeguimientoReporte> {
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
  }
}