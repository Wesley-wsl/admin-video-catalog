import { SortDirection } from "@seedwork/domain/repository/repository-contract";
import { InMemorySearchableRepository } from "../../../@seedwork/domain/repository/in-memory.repository";
import { Category } from "category/domain/entities/category";
import { CategoryRepository } from "category/domain/repository/category.repository";

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepository.IRepository
{
  sortableFields: string[] = ["name", "created_at"];

  protected async applyFilter(
    items: Category[],
    filter: CategoryRepository.Filter
  ): Promise<Category[]> {
    if (!filter) return items;

    return items.filter((i) =>
      i.props.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  protected async applySort(
    items: Category[],
    sort: string,
    sort_dir: SortDirection
  ): Promise<Category[]> {
    return !sort
      ? super.applySort(items, "created_at", "asc")
      : super.applySort(items, sort, sort_dir);
  }
}
