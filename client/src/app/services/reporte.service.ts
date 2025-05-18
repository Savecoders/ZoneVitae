import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, of } from 'rxjs';
import { BaseService } from './base.service';
import { Reporte } from '../models/reporte.model';
import { ReporteCompleto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ReporteService extends BaseService<Reporte> {
  constructor(http: HttpClient) {
    super(http, 'reports');
  }

  // Get all reports with optional filtering
  getReportes(titulo?: string, estado?: string): Observable<Reporte[]> {
    return this.getAll().pipe(
      map((reportes) =>
        reportes.filter(
          (reporte) =>
            (titulo
              ? reporte.titulo.toLowerCase().includes(titulo.toLowerCase())
              : true) && (estado ? reporte.estado === estado : true)
        )
      )
    );
  }

  // Get report by id
  getReporteById(id: number): Observable<Reporte> {
    return this.getById(id);
  }

  // Create a new report
  createReporte(reporte: Reporte): Observable<Reporte> {
    return this.create(reporte);
  }

  // Update report
  updateReporte(id: number, reporte: Partial<Reporte>): Observable<Reporte> {
    return this.update(id, reporte);
  }

  // Delete report
  deleteReporte(id: number): Observable<void> {
    return this.delete(id);
  }

  // Get reports by community
  getReportesByComunidad(comunidadId: number): Observable<Reporte[]> {
    return this.getAll().pipe(
      map((reportes) =>
        reportes.filter((reporte) => reporte.comunidad_id === comunidadId)
      )
    );
  }

  // Get reports by author
  getReportesByAutor(autorId: number): Observable<Reporte[]> {
    return this.getAll().pipe(
      map((reportes) =>
        reportes.filter((reporte) => reporte.autor_id === autorId)
      )
    );
  }

  // Get reports by tag
  getReportesByTag(tagId: number): Observable<Reporte[]> {
    // First get the report-tag relations
    return this.http
      .get<ReporteCompleto[]>(
        `${this.baseUrl.replace('/reports', '')}/reports_tags?tag_id=${tagId}`
      )
      .pipe(
        map((relations) => relations.map((relation) => relation.tags)),
        switchMap((reportIds) => {
          if (reportIds.length === 0) {
            return of([] as Reporte[]);
          }
          // Construct query params for multiple IDs
          const queryParams = reportIds.map((id) => `id=${id}`).join('&');
          return this.http.get<Reporte[]>(`${this.baseUrl}?${queryParams}`);
        })
      );
  }
}
