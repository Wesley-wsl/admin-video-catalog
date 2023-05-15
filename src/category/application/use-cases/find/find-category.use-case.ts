import { IUseCase } from "../../../../@seedwork/application/use-cases/use-case";
import { CategoryRepository } from "../../../domain/repository/category.repository";
import { IFindCategoryInput, IFindCategoryOutput } from "./find-category.dto";

export class FindCategoryUseCase
  implements IUseCase<IFindCategoryInput, IFindCategoryOutput>
{
  constructor(private categoryRepository: CategoryRepository.IRepository) {}

  async execute(input: IFindCategoryInput) {
    const category = await this.categoryRepository.findById(input.id);
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      is_active: category.isActive,
      created_at: category.created_at,
    };
  }
}
