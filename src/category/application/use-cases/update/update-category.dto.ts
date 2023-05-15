export interface IUpdateCategoryInput {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
}

export interface IUpdateCategoryOutput {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
  created_at: Date;
}
