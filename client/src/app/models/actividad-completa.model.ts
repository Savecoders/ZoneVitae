import { Usuario } from './usuario.model';
import { Comunidad } from './comunidad.model';
import { Comentario } from './comentario.model';

export interface ActividadCompleta {
  id?: number;
  nombre: string;
  descripcion?: string | null;
  fecha_inicio: Date | string;
  fecha_fin: Date | string;
  ubicacion: string;
  virtual: boolean;
  frecuencia: string;
  cover?: string | null;
  fecha?: Date | string;
  create_at?: Date | string;
  update_at?: Date | string;
  comunidad?: Comunidad;
  comentarios?: ComentarioCompleto[];
}

export interface ComentarioCompleto extends Comentario {
  autor?: Usuario;
}
