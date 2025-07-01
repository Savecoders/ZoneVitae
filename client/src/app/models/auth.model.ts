export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombreUsuario: string;
  email: string;
  password: string;
  confirmPassword?: string;
  genero?: string;
  fechaNacimiento?: Date | string;
  fotoPerfil?: File;
}

export interface AuthResponse {
  token: string;
  usuario: {
    id: string;
    nombreUsuario: string;
    email: string;
    genero?: string | null;
    fechaNacimiento?: Date | string | null;
    fotoPerfil?: string | null;
    estadoCuenta: string;
    roles: string[] | null;
  };
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordUpdateRequest {
  token: string;
  password: string;
  confirmPassword: string;
}
