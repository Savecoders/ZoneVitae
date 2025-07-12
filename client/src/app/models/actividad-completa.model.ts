import { Usuario } from './usuario.model';
import { Comunidad } from './comunidad.model';
import { Comentario } from './comentario.model';

export interface ActividadCompleta {
  id?: number;
  nombre: string;
  descripcion?: string | null;
  fechaInicio: Date | string;
  fechaFin: Date | string;
  ubicacion: string;
  virtual: boolean;
  frecuencia: string;
  fecha?: Date | string;
  create_at?: Date | string;
  update_at?: Date | string;
  comunidad?: Comunidad;
  comentarios?: ComentarioCompleto[];
}

export interface ComentarioCompleto extends Comentario {
  autor?: Usuario;
}
