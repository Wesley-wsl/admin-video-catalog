import { IUseCase } from "../../../../@seedwork/application/use-cases/use-case";
import { Category } from "../../../domain/entities/category";
import { CategoryRepository } from "../../../domain/repository/category.repository";
import {
  IUpdateCategoryInput,
  IUpdateCategoryOutput,
} from "./update-category.dto";

export class UpdateCategoryUseCase
  implements IUseCase<IUpdateCategoryInput, IUpdateCategoryOutput>
{
  constructor(private categoryRepository: CategoryRepository.IRepository) {}

  async execute(input: IUpdateCategoryInput) {
    const categoryFinded = await this.categoryRepository.findById(input.id);
    categoryFinded.update({ name: input.name, description: input.description });

    if (input.is_active) categoryFinded.activate();
    if (input.is_active === false) categoryFinded.deactivate();

    await this.categoryRepository.update(categoryFinded);

    return {
      id: categoryFinded.id,
      name: categoryFinded.name,
      description: categoryFinded.description,
      is_active: categoryFinded.isActive,
      created_at: categoryFinded.created_at,
    };
  }
}
