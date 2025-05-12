export interface Actividad {
  ID?: number;
  comunidad_id?: number | null;
  nombre: string;
  descripcion?: string | null;
  fecha_inicio: Date | string;
  fecha_fin: Date | string;
  ubicacion: string;
  virtual: boolean;
  frecuencia: string;
  cover?: string | null;
  fecha?: Date | string;
  create_at?: Date | string;
  update_at?: Date | string;
}
