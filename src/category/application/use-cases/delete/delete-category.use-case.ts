import { IUseCase } from "../../../../@seedwork/application/use-cases/use-case";
import { CategoryRepository } from "../../../domain/repository/category.repository";
import {
  IDeleteCategoryInput,
  IDeleteCategoryOutput,
} from "./delete-category.dto";

export class DeleteCategoryUseCase
  implements IUseCase<IDeleteCategoryInput, IDeleteCategoryOutput>
{
  constructor(private categoryRepository: CategoryRepository.IRepository) {}

  async execute(input: IDeleteCategoryInput) {
    const category = await this.categoryRepository.findById(input.id);
    await this.categoryRepository.delete(category.id);
  }
}
