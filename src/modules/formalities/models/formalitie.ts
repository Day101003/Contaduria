export interface Formalitie {
  id: number;
  title: string;
  description: string;
  image?: string | null;
  category: string;
  date: string;
  active: boolean;
}

export interface CreateFormalitieDto {
  title: string;
  description: string;
  image?: string | null;
  category: string;
  date: string;
  active: boolean;
}

export interface UpdateFormalitieDto {
  title?: string;
  description?: string;
  image?: string | null;
  category?: string;
  date?: string;
  active?: boolean;
}
