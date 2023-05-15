export interface IFindCategoryInput {
  id: string;
}

export interface IFindCategoryOutput {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
  created_at: Date;
}
