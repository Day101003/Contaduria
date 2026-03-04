export interface Report {
  id: number;
  title: string;
  description: string;
    image?: string | null;
  category: string;
  date: string;
  active: boolean;
}

export interface CreateReportDto {
  title: string;
  description: string;
    image?: string | null;
  category: string;
  date: string;
  active: boolean;
}

export interface UpdateReportDto {
  title?: string;
  description?: string;
    image?: string | null;
  category?: string;
  date?: string;
  active?: boolean;
}
