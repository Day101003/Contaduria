export interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
  is_delete?: boolean;
}

export interface CreateRolDto {
  nombre: string;
  descripcion: string;
}

export interface UpdateRolDto {
  nombre?: string;
  descripcion?: string;
}
