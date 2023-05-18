export interface ICategoryProperties {
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
}

export interface ICategoryUpdate {
  name: string;
  description: string;
}
