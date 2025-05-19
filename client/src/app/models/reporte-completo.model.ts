import { Usuario } from './usuario.model';
import { Comunidad } from './comunidad.model';
import { Tag } from './tag.model';
import { Foto } from './foto.model';
import { EstadoReporte, SeguimientoReporteEnum } from './reporte.model';
import { SeguimientoReporte } from './seguimiento-reporte.model';


export interface ReporteCompleto {
  id?: number;
  titulo: string;
  contenido: string;
  anonimo: boolean;
  estado: EstadoReporte;
  estado_seguimiento: SeguimientoReporteEnum;
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
