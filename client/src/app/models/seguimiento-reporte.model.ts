export enum PrioridadSeguimientoReporte {
  BAJA = 'Baja',
  MEDIA = 'Media',
  ALTA = 'Alta',
  CRITICA = 'Crítica',
}

export interface SeguimientoReporte {
  id?: number;
  reporte_id: number;
  usuario_id: number;
  estado_anterior: string;
  estado_nuevo: string;
  comentario: string;
  accion_realizada: string;
  accion_recomendada?: string | null;
 documentos_adjuntos: boolean;
  prioridad: PrioridadSeguimientoReporte;
  create_at?: Date | string;
  update_at?: Date | string;
  imagen?: string | null;
}
