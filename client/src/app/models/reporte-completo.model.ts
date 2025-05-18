import { Usuario } from './usuario.model';
import { Comunidad } from './comunidad.model';
import { Tag } from './tag.model';
import { SeguimientoReporte } from './seguimiento-reporte.model';
import { Foto } from './foto.model';

export interface ReporteCompleto {
  id?: number;
  titulo: string;
  contenido: string;
  anonimo: boolean;
  estado: string;
  estado_seguimiento: string;
  create_at?: Date | string;
  update_at?: Date | string;
  autor?: Usuario | null;
  comunidad?: Comunidad;
  fotos?: Foto[];
  tags?: Tag[];
  me_encanta_count?: number;
  usuarios_me_encanta?: Usuario[];
  seguimientos?: SeguimientoReporte[];
}
