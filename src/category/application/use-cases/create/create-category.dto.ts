export interface ICreateCategoryInput {
  name: string;
  description?: string;
  is_active?: boolean;
}

export interface ICreateCategoryOutput {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
  created_at: Date;
}
