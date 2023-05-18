import { IUseCase } from "../../../../@seedwork/application/use-cases/use-case";
import { Category } from "../../../domain/entities/category";
import { CategoryRepository } from "../../../domain/repository/category.repository";
import {
  ICreateCategoryInput,
  ICreateCategoryOutput,
} from "./create-category.dto";

export class CreateCategoryUseCase
  implements IUseCase<ICreateCategoryInput, ICreateCategoryOutput>
{
  constructor(private categoryRepository: CategoryRepository.IRepository) {}

  async execute(input: ICreateCategoryInput) {
    const category = new Category(input);
    await this.categoryRepository.insert(category);
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      is_active: category.isActive,
      created_at: category.created_at,
    };
  }
}
