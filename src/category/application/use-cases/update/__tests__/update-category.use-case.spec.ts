import NotFoundError from "../../../../../@seedwork/domain/errors/not-found.error";
import { Category } from "../../../../domain/entities/category";
import { CategoryInMemoryRepository } from "../../../../infra/repository/category-in-memory.repository";
import { UpdateCategoryUseCase } from "../update-category.use-case";

describe("CreateCategoryUseCase Unit Tests", () => {
  let categoryInMemoryRepository: CategoryInMemoryRepository;
  let updateCategoryUseCase: UpdateCategoryUseCase;

  beforeEach(() => {
    categoryInMemoryRepository = new CategoryInMemoryRepository();
    updateCategoryUseCase = new UpdateCategoryUseCase(
      categoryInMemoryRepository
    );
  });

  it("should throw error when category is not found.", () => {
    expect(() =>
      updateCategoryUseCase.execute({ id: "fake", name: "fake" })
    ).rejects.toThrow(new NotFoundError("Entity Not Found using ID fake"));
  });

  it("should be able to update a category with success.", async () => {
    const spyUpdateMethod = jest.spyOn(categoryInMemoryRepository, "update");
    const category = new Category({ name: "test" });

    categoryInMemoryRepository.items[0] = category;

    const result = await updateCategoryUseCase.execute({
      id: category.id,
      name: "random",
      description: "random",
    });

    expect(spyUpdateMethod).toHaveBeenCalledTimes(1);

    expect(result).toStrictEqual({
      id: category.id,
      name: category.name,
      description: category.description,
      is_active: category.isActive,
      created_at: category.created_at,
    });
  });

  it("should be able to activate a category.", async () => {
    const spyUpdateMethod = jest.spyOn(categoryInMemoryRepository, "update");
    const category = new Category({ name: "test" });
    category.deactivate();

    categoryInMemoryRepository.items[0] = category;

    let result = await updateCategoryUseCase.execute({
      id: category.id,
      name: "random",
      description: "random",
      is_active: true,
    });

    expect(spyUpdateMethod).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual({
      id: category.id,
      name: category.name,
      description: category.description,
      is_active: category.isActive,
      created_at: category.created_at,
    });
  });

  it("should be able to deactivate a category.", async () => {
    const spyUpdateMethod = jest.spyOn(categoryInMemoryRepository, "update");
    const category = new Category({ name: "test" });
    category.activate();

    categoryInMemoryRepository.items[0] = category;

    let result = await updateCategoryUseCase.execute({
      id: category.id,
      name: "random",
      description: "random",
      is_active: false,
    });

    expect(spyUpdateMethod).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual({
      id: category.id,
      name: category.name,
      description: category.description,
      is_active: category.isActive,
      created_at: category.created_at,
    });
  });
});
