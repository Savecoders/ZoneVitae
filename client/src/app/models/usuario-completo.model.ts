import { Rol } from './rol.model';
import { Comunidad } from './comunidad.model';
import { RolComunidad } from './rol-comunidad.model';

export interface UsuarioCompleto {
  id?: number;
  nombre_usuario: string;
  email: string;
  foto_perfil?: string | null;
  fecha_nacimiento?: Date | string | null;
  genero?: string | null;
  estado_cuenta?: string;
  create_at?: Date | string;
  update_at?: Date | string;
  roles?: Rol[];
  comunidades_admin?: Comunidad[];
  comunidades?: UsuarioComunidadInfo[];
  comunidades_seguidas?: Comunidad[];
}

export interface UsuarioComunidadInfo {
  comunidad: Comunidad;
  rol: RolComunidad;
  fecha_asignacion: Date | string;
}
