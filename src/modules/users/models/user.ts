export interface User {
  id: number;
  nombre: string;
  apellidos: string;
  foto_de_perfil: string;
  telefono: string;
  cedula: string;
  correo: string;
  rol_id: number;
  direccion: string;
  is_delete: boolean;
}

export interface CreateUserDto {
  nombre: string;
  apellidos: string;
  foto_de_perfil?: string;
  telefono: string;
  cedula: string;
  correo: string;
  rol_id: number;
  direccion: string;
}

export interface UpdateUserDto {
  nombre?: string;
  apellidos?: string;
  foto_de_perfil?: string;
  telefono?: string;
  cedula?: string;
  correo?: string;
  rol_id?: number;
  direccion?: string;
}
