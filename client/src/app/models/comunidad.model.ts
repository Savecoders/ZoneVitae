import { Tag } from "./tag.model";

export enum EstadoComunidad {
  APROBADO = 'Aprobado',
  POR_APROBAR = 'Por Aprobar',
  RECHAZADO = 'Rechazado',
}

export enum TipoComunidad {
  PUBLICA = 'Publica',
  RESTRINGIDA = 'Restringida',
  PRIVADA = 'Privada',
}
 
export interface Comunidad {
  id?: string;
  nombre: string;
  descripcion: string;
  tipoComunidad: TipoComunidad;
  soloMayoresEdad: boolean;
  logo?: string | null;
  cover?: string | null;
  tags?: Tag[];
  creador_id?: number | null;
  estado?: EstadoComunidad;
  ubicacion: string;
  create_at?: Date | string;
  update_at?: Date | string;
}
