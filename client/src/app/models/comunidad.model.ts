export enum EstadoComunidad {
  APROBADO = 'Aprobado',
  POR_APROBAR = 'Por Aprobar',
  RECHAZADO = 'Rechazado',
}

export interface Comunidad {
  id?: number;
  nombre: string;
  descripcion?: string | null;
  logo?: string | null;
  cover?: string | null;
  creador_id?: number | null;
  ubicacion: string;
  create_at?: Date | string;
  update_at?: Date | string;
}
