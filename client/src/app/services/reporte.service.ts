import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, of } from 'rxjs';
import { BaseService } from './base.service';
import { Reporte } from '../models/reporte.model';
import { ReporteCompleto } from '../models';
import { SeguimientoReporte } from '../models/seguimiento-reporte.model';

@Injectable({
  providedIn: 'root',
})
export class ReporteService extends BaseService<ReporteCompleto> {
  private jsonUrl:string = "http://localhost:5000/reports";

  constructor(http: HttpClient) {
    super(http, 'reports');
  }

  //carga los datos del reporte
  getReporte():Observable<ReporteCompleto[]>{
    return this.http.get<ReporteCompleto[]>(this.jsonUrl);
  }


  //Agregar Reporte
  createReporte(reporte: ReporteCompleto): Observable<ReporteCompleto> {
    return this.http.post<ReporteCompleto>(this.jsonUrl, reporte)
  }

  //Editar Reporte
  editReporte(reporte: ReporteCompleto): Observable<ReporteCompleto> {
    const url= `${this.jsonUrl}/${reporte.id}`;
    return this.http.put<ReporteCompleto>(url, reporte);
  }
  
  //Eliminar Reporte
  deleteReporte(id: number): Observable<void> {
    const url = `${this.jsonUrl}/${id}`;
    return this.http.delete<void>(url);
  }
  
  //BuscarTag
  buscarPorTag(nombreTag: string): Observable<ReporteCompleto[]> {
    const nombreTagLower = nombreTag.toLowerCase();
    return this.getReporte().pipe(
      map(reportes =>
        reportes.filter(r =>
          r.tags?.some(tag => tag.nombre.toLowerCase() === nombreTagLower)
        )
      )
    );
  }

  
   
crearSeguimientoReporte(seguimiento: SeguimientoReporte): Observable<SeguimientoReporte> {
  return this.http.post<SeguimientoReporte>(`${this.baseUrl.replace('/reports', '')}/seguimiento_reportes`, seguimiento);
}



updateSeguimiento(id: number, cambios: Partial<SeguimientoReporte>): Observable<SeguimientoReporte> {
  return this.http.patch<SeguimientoReporte>(`${this.baseUrl.replace('/reports', '')}/seguimiento_reportes/${id}`, cambios);
}




}
