export interface Service {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export interface CreateServiceDto {
  name: string;
  description: string;
  active: boolean;
}

export interface UpdateServiceDto {
  name?: string;
  description?: string;
  active?: boolean;
}
