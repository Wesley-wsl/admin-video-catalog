import { IUseCase } from "../../../../@seedwork/application/use-cases/use-case";
import { CategoryRepository } from "../../../domain/repository/category.repository";
import {
  IListCategoriesInput,
  IListCategoriesOutput,
} from "./list-categories.dto";

export class ListCategoriesUseCase
  implements IUseCase<IListCategoriesInput, IListCategoriesOutput>
{
  constructor(private categoryRepository: CategoryRepository.IRepository) {}

  async execute(input: IListCategoriesInput): Promise<IListCategoriesOutput> {
    const searchParams = new CategoryRepository.SearchParams(input);
    const searchResult = await this.categoryRepository.search(searchParams);
    return searchResult;
  }
}
