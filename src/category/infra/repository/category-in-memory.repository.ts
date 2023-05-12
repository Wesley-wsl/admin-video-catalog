import {
  InMemoryRepository,
  InMemorySearchableRepository,
} from "../../../@seedwork/domain/repository/in-memory.repository";
import { Category } from "category/domain/entities/category";
import { ICategoryRepository } from "category/domain/repository/category.repository";

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements ICategoryRepository
{
  protected applyFilter(
    items: Category[],
    filter: string
  ): Promise<Category[]> {
    throw new Error("Method not implemented.");
  }
}
