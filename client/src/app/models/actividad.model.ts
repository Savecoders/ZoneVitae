export interface Actividad {
  id?: number;
  nombre: string;
  descripcion?: string | null;
  fechaInicio: Date | string;
  fechaFin: Date | string;
  ubicacion: string;
  virtual: boolean;
  frecuencia: string;
  fecha?: Date | string;
  create_at?: Date | string;
  update_at?: Date | string;
}
