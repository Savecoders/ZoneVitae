import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BaseService } from './base.service';
import { Actividad } from '../models/actividad.model';

@Injectable({
  providedIn: 'root',
})
export class ActividadService extends BaseService<Actividad> {
  constructor(http: HttpClient) {
    super(http, 'actividades');
  }

  // Get all activities with optional filtering
  getActividades(
    nombre?: string,
    fechaInicio?: Date | string,
    fechaFin?: Date | string,
    ubicacion?: string
  ): Observable<Actividad[]> {
    return this.getAll().pipe(
      map((actividades) =>
        actividades.filter(
          (actividad) =>
            (nombre
              ? actividad.nombre.toLowerCase().includes(nombre.toLowerCase())
              : true) &&
            (fechaInicio
              ? new Date(actividad.fechaInicio) >= new Date(fechaInicio)
              : true) &&
            (fechaFin
              ? new Date(actividad.fechaFin) <= new Date(fechaFin)
              : true) &&
            (ubicacion
              ? actividad.ubicacion
                  .toLowerCase()
                  .includes(ubicacion.toLowerCase())
              : true)
        )
      )
    );
  }

  // Get activity by id
  getActividadById(id: number): Observable<Actividad> {
    return this.getById(id);
  }

  // Create a new activity
  createActividad(actividad: Actividad): Observable<Actividad> {
    return this.create(actividad);
  }

  // Update activity
  updateActividad(
    id: number,
    actividad: Partial<Actividad>
  ): Observable<Actividad> {
    return this.update(id, actividad);
  }

  // Delete activity
  deleteActividad(id: number): Observable<void> {
    return this.delete(id);
  }

  // Get upcoming activities
  getActividadesProximas(): Observable<Actividad[]> {
    const today = new Date();

    return this.getAll().pipe(
      map((actividades) =>
        actividades
          .filter((actividad) => new Date(actividad.fechaInicio) >= today)
          .sort(
            (a, b) =>
              new Date(a.fechaInicio).getTime() -
              new Date(b.fechaInicio).getTime()
          )
      )
    );
  }
}
