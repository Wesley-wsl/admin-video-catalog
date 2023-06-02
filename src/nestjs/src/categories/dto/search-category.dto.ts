import { IListCategoriesInput } from '@core/admin-video-catalog/category/application';
import { ISearchInputDto } from '@core/admin-video-catalog/dist/@seedwork/application/dto/search-input.dto';
import { SortDirection } from '@core/admin-video-catalog/dist/@seedwork/domain/repository/repository-contract';

export class SearchCategoryDto {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: string;
}
