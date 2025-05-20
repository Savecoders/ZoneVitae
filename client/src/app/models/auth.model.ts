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
    id: number;
    nombre_usuario: string;
    email: string;
    genero?: string | null;
    fecha_nacimiento?: Date | string | null;
    foto_perfil?: string | null;
    roles: string[];
  };
}

// Mock token info for json-server
export interface MockTokenInfo {
  userId: number;
  expiresAt: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordUpdateRequest {
  token: string;
  password: string;
  confirmPassword: string;
}
