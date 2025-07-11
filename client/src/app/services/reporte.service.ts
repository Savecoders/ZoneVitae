import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, of } from 'rxjs';
import { BaseService } from './base.service';
import { Reporte } from '../models/reporte.model';
import { ReporteCompleto } from '../models';

import { SeguimientoReporte } from '../models/seguimiento-reporte.model';
import { environment } from 'environments/environment.development';



@Injectable({
  providedIn: 'root',
})
export class ReporteService extends BaseService<ReporteCompleto> {
  private jsonUrl: string = `${environment.jsonServerUrl}/reports`;

  constructor(http: HttpClient) {
    super(http, 'reports');
  }

  //carga los datos del reporte
 getReporte(): Observable<ReporteCompleto[]> {
  return this.http.get<ReporteCompleto[]>(this.jsonUrl).pipe(
    map(reportes =>
      reportes.map(reporte => ({
        ...reporte,
        createAtDate: reporte.create_at ? new Date(reporte.create_at) : null,
        updateAtDate: reporte.update_at ? new Date(reporte.update_at) : null,
      }))
    )
  );
}

  //Agregar Reporte
  createReporte(dto: any): Observable<ReporteCompleto> {
    return this.http.post<ReporteCompleto>(this.jsonUrl, dto);
  }


  //Editar Reporte
editReporte(id: number, dto: any): Observable<ReporteCompleto> {
  return this.http.put<ReporteCompleto>(`${this.jsonUrl}/${id}`, dto);
}

  //Eliminar Reporte
  deleteReporte(id: number): Observable<void> {
    const url = `${this.jsonUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  //BuscarTag
  buscarPorTag(nombreTag: string): Observable<ReporteCompleto[]> {
    const url = `${this.jsonUrl}/filtrar-por-tag?tag=${encodeURIComponent(nombreTag)}`;
    return this.http.get<ReporteCompleto[]>(url);
  }



  // ...existing code...
getReporteById(id: number): Observable<ReporteCompleto> {
  return this.http.get<ReporteCompleto>(`${this.jsonUrl}/${id}`).pipe(
    map(reporte => ({
      ...reporte,
        createAtDate: reporte.create_at ? new Date(reporte.create_at) : null,
        updateAtDate: reporte.update_at ? new Date(reporte.update_at) : null,
    }))
  )}
// ...existing code...
   
crearSeguimientoReporte(seguimiento: SeguimientoReporte): Observable<SeguimientoReporte> {
  return this.http.post<SeguimientoReporte>(`${this.baseUrl.replace('/reports', '')}/seguimiento_reportes`, seguimiento);
}



updateSeguimiento(id: number, cambios: Partial<SeguimientoReporte>): Observable<SeguimientoReporte> {
  return this.http.patch<SeguimientoReporte>(`${this.baseUrl.replace('/reports', '')}/seguimiento_reportes/${id}`, cambios);
}

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


  // Buscar reportes por autor
  getReportesByAutor(autorId: number): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(`${this.jsonUrl}?autor_id=${autorId}`);
  }

}
