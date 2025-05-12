export enum UsuarioGenero {
  MASCULINO = 'M',
  FEMENINO = 'F',
  OTRO = 'O',
}

export enum EstadoCuentaUsuario {
  ACTIVO = 'Activo',
  SUSPENDIDO = 'Suspendido',
  INACTIVO = 'Inactivo',
}

export interface Usuario {
  ID?: number;
  nombre_usuario: string;
  email: string;
  password?: string;
  foto_perfil?: string | null;
  fecha_nacimiento?: Date | string | null;
  genero?: UsuarioGenero | null;
  estado_cuenta?: EstadoCuentaUsuario;
  create_at?: Date | string;
  update_at?: Date | string;
}
