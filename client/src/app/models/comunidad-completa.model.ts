import { Usuario } from './usuario.model';
import { Comunidad } from './comunidad.model'
import { RolComunidad } from './rol-comunidad.model';
import { Tag } from './tag.model';

export interface ComunidadCompleta extends Comunidad {
  creador?: Usuario;
  miembros?: UsuarioComunidadCompleta[];
  tags?: Tag[];
  galeria?: string[];
  followers_count?: number;
  followers?: Usuario[];
}

export interface UsuarioComunidadCompleta {
  usuario: Usuario;
  rol: RolComunidad;
  fecha_asignacion: Date | string;
}
