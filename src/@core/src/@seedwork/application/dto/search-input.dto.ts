import { SortDirection } from "../../../@seedwork/domain/repository/repository-contract";

export type ISearchInputDto<Filter = string> = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: Filter | null;
};
