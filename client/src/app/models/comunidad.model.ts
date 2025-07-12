import { Tag } from "./tag.model";

export enum EstadoComunidad {
  APROBADO = "Aprobado",
  POR_APROBAR = "Pendiente de Revision",
  RECHAZADO = "Rechazado",
  SUSPENDIDO = "Suspendido"
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
  creadorId?: string | null;
  estado?: EstadoComunidad;
  ubicacion: string;
  create_at?: Date | string;
  update_at?: Date | string;
}
