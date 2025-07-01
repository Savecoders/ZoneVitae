import { Tag } from "./tag.model";

export enum EstadoComunidad {
  APROBADO = "Aprobado",
  POR_APROBAR = "Por Aprobar",
  RECHAZADO = "Rechazado",
}

export enum TipoComunidad {
  PUBLICA = "Publica",
  RESTRINGIDA = "Restringida",
  PRIVADA = "Privada",
}

export interface Comunidad {
  id?: string;
  nombre: string;
  descripcion: string;
  logo?: string | null;
  cover?: string | null;
  tipoComunidad: TipoComunidad;
  soloMayoresEdad: boolean;
  tags?: Tag[];
  creador_id?: number | null;
  estado?: EstadoComunidad;
  ubicacion: string;
  create_at?: Date | string;
  update_at?: Date | string;
}
