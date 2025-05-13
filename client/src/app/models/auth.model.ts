export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre_usuario: string;
  email: string;
  password: string;
  confirmPassword?: string;
  fecha_nacimiento?: Date | string;
  genero?: string;
}

export interface AuthResponse {
  token: string;
  expires: Date | string;
  user: {
    ID: number;
    nombre_usuario: string;
    email: string;
    foto_perfil?: string | null;
    roles: string[];
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
