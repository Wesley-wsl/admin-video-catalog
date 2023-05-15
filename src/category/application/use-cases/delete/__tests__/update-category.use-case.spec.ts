import NotFoundError from "../../../../../@seedwork/domain/errors/not-found.error";
import { Category } from "../../../../domain/entities/category";
import { CategoryInMemoryRepository } from "../../../../infra/repository/category-in-memory.repository";
import { DeleteCategoryUseCase } from "../delete-category.use-case";

describe("CreateCategoryUseCase Unit Tests", () => {
  let categoryInMemoryRepository: CategoryInMemoryRepository;
  let deleteCategoryUseCase: DeleteCategoryUseCase;

  beforeEach(() => {
    categoryInMemoryRepository = new CategoryInMemoryRepository();
    deleteCategoryUseCase = new DeleteCategoryUseCase(
      categoryInMemoryRepository
    );
  });

  it("should throw error when category is not found.", () => {
    expect(() => deleteCategoryUseCase.execute({ id: "fake" })).rejects.toThrow(
      new NotFoundError("Entity Not Found using ID fake")
    );
  });

  it("should be able to delete a category with success.", async () => {
    const spyDeleteMethod = jest.spyOn(categoryInMemoryRepository, "delete");
    const category = new Category({ name: "test" });

    categoryInMemoryRepository.items[0] = category;

    await deleteCategoryUseCase.execute({
      id: category.id,
    });

    expect(spyDeleteMethod).toHaveBeenCalledTimes(1);
    expect(categoryInMemoryRepository.items[0]).toBeFalsy();
  });
});
