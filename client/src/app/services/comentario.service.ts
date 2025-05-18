import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BaseService } from './base.service';
import { Comentario } from '../models/comentario.model';

@Injectable({
  providedIn: 'root',
})
export class ComentarioService extends BaseService<Comentario> {
  constructor(http: HttpClient) {
    super(http, 'comentarios');
  }

  // Get all comments
  getComentarios(): Observable<Comentario[]> {
    return this.getAll();
  }

  // Get comment by id
  getComentarioById(id: number): Observable<Comentario> {
    return this.getById(id);
  }

  // Create a new comment
  createComentario(comentario: Comentario): Observable<Comentario> {
    return this.create(comentario);
  }

  // Update comment
  updateComentario(
    id: number,
    comentario: Partial<Comentario>
  ): Observable<Comentario> {
    return this.update(id, comentario);
  }

  // Delete comment
  deleteComentario(id: number): Observable<void> {
    return this.delete(id);
  }

  // Get comments by activity
  getComentariosByActividad(actividadId: number): Observable<Comentario[]> {
    return this.getAll().pipe(
      map((comentarios) =>
        comentarios.filter(
          (comentario) => comentario.actividades_Id === actividadId
        )
      )
    );
  }

  // Get comments by user
  getComentariosByUsuario(usuarioId: number): Observable<Comentario[]> {
    return this.getAll().pipe(
      map((comentarios) =>
        comentarios.filter((comentario) => comentario.autor_id === usuarioId)
      )
    );
  }
}
