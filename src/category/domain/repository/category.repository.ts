import {
  ISearchableRepository,
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
} from "@seedwork/domain/repository/repository-contract";
import { Category } from "../entities/category";

export namespace CategoryRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}

  export class SearchResult extends DefaultSearchResult<Category, Filter> {}

  export interface IRepository
    extends ISearchableRepository<
      Category,
      Filter,
      SearchParams,
      SearchResult
    > {}
}
