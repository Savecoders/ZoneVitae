export interface Comentario {
  id?: number;
  actividades_Id?: number | null;
  autor_id?: number | null;
  contenido: string;
  fecha_comentario?: Date | string;
}
