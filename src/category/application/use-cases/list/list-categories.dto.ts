import { ISearchInputDto } from "../../../../@seedwork/application/dto/search-input.dto";
import { IFindCategoryOutput } from "../find/find-category.dto";

export type IListCategoriesInput = ISearchInputDto;

export interface Category {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
  created_at: Date;
}

export interface IListCategoriesOutput {
  items: Category[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}
