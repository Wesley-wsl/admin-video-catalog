import { CategoryModel } from "#category/infra/db/sequelize/category-model";
import { CategorySequelizeRepository } from "#category/infra/db/sequelize/category-repository";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import NotFoundError from "../../../../../@seedwork/domain/errors/not-found.error";
import { Category } from "../../../../domain/entities/category";
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository";
import { FindCategoryUseCase } from "../find-category.use-case";

describe("CreateCategoryUseCase Integration Tests", () => {
  setupSequelize({ models: [CategoryModel] });
  let categoryRepository: CategorySequelizeRepository;
  let findCategoryUseCase: FindCategoryUseCase;

  beforeEach(() => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    findCategoryUseCase = new FindCategoryUseCase(categoryRepository);
  });

  it("should throw error when category is not found", async () => {
    await expect(() =>
      findCategoryUseCase.execute({ id: "fake_id" })
    ).rejects.toThrow(new NotFoundError(`Entity Not Found using ID fake_id`));
  });

  it("should be able to find a category by id.", async () => {
    const newCategory = new Category({ name: "ok" });
    await categoryRepository.insert(newCategory);

    const output = await findCategoryUseCase.execute({ id: newCategory.id });

    expect(output).toStrictEqual({
      id: newCategory.id,
      name: newCategory.name,
      description: newCategory.description,
      is_active: newCategory.isActive,
      created_at: newCategory.created_at,
    });
  });
});
