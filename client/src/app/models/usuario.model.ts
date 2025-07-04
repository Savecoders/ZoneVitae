export enum UsuarioGenero {
  MASCULINO = "M",
  FEMENINO = "F",
  OTRO = "O",
}

export enum EstadoCuentaUsuario {
  ACTIVO = "Activo",
  SUSPENDIDO = "Suspendido",
  INACTIVO = "Inactivo",
}

export interface Usuario {
  id?: string; // Guid in C#
  nombreUsuario: string;
  email: string;
  password?: string;
  fotoPerfil?: string | null;
  fechaNacimiento?: Date | string | null;
  genero: string;
  estadoCuenta: string;
  deletedAt?: Date | string | null;
  createAt?: Date | string;
  updateAt?: Date | string;
}
