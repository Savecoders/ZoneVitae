export enum EstadoReporte {
  PENDIENTE_REVISION = 'Pendiente de Revision',
  APROBADO = 'Aprobado',
  DENEGADO = 'Denegado',
}

export enum SeguimientoReporteEnum {
  DENEGADO = 'Denegado',
  PENDIENTE_REVISION = 'Pendiente de Revision',
  REVISADO = 'Revisado',
  RESUELTO = 'Resuelto',
}

export interface Reporte {
  id?: number;
  comunidad_id?: number | null;
  autor_id?: number | null;
  titulo: string;
  contenido: string;
  anonimo: boolean;
  estado: EstadoReporte;
  estado_seguimiento: SeguimientoReporteEnum;
  create_at?: Date | string;
  update_at?: Date | string;
}
