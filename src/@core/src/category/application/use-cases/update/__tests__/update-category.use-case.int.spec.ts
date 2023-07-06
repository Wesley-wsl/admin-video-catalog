import { CategoryModel } from "#category/infra/db/sequelize/category-model";
import { CategorySequelizeRepository } from "#category/infra/db/sequelize/category-repository";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import NotFoundError from "../../../../../@seedwork/domain/errors/not-found.error";
import { Category } from "../../../../domain/entities/category";
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository";
import { UpdateCategoryUseCase } from "../update-category.use-case";

describe("CreateCategoryUseCase Integration Tests", () => {
  setupSequelize({ models: [CategoryModel] });

  let categoryRepository: CategorySequelizeRepository;
  let updateCategoryUseCase: UpdateCategoryUseCase;

  beforeEach(() => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
  });

  it("should throw error when category is not found.", async () => {
    await expect(() =>
      updateCategoryUseCase.execute({ id: "fake", name: "fake" })
    ).rejects.toThrow(new NotFoundError("Entity Not Found using ID fake"));
  });

  it("should be able to update a category with success.", async () => {
    const category = new Category({ name: "test" });
    await categoryRepository.insert(category);

    const propertiesToChange = {
      name: "random",
      description: "random",
    };

    const result = await updateCategoryUseCase.execute({
      id: category.id,
      ...propertiesToChange,
    });

    expect(result).toStrictEqual({
      id: category.id,
      name: propertiesToChange.name,
      description: propertiesToChange.description,
      is_active: category.isActive,
      created_at: category.created_at,
    });
  });

  it("should be able to activate a category.", async () => {
    const category = new Category({ name: "test" });
    category.deactivate();

    await categoryRepository.insert(category);

    const propertiesToChange = {
      name: "random",
      description: "random",
      is_active: true,
    };

    let result = await updateCategoryUseCase.execute({
      id: category.id,
      ...propertiesToChange,
    });

    expect(result).toStrictEqual({
      id: category.id,
      name: propertiesToChange.name,
      description: propertiesToChange.description,
      is_active: propertiesToChange.is_active,
      created_at: category.created_at,
    });
  });

  it("should be able to deactivate a category.", async () => {
    const category = new Category({ name: "test" });
    category.activate();

    await categoryRepository.insert(category);

    const propertiesToChange = {
      name: "random",
      description: "random",
      is_active: false,
    };

    let result = await updateCategoryUseCase.execute({
      id: category.id,
      ...propertiesToChange,
    });

    expect(result).toStrictEqual({
      id: category.id,
      name: propertiesToChange.name,
      description: propertiesToChange.description,
      is_active: propertiesToChange.is_active,
      created_at: category.created_at,
    });
  });
});
