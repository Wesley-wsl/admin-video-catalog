import { CategoryModel } from "#category/infra/db/sequelize/category-model";
import { CategorySequelizeRepository } from "#category/infra/db/sequelize/category-repository";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { CreateCategoryUseCase } from "../create-category.use-case";

describe("CreateCategoryUseCase Integration Tests", () => {
  setupSequelize({ models: [CategoryModel] });
  let categoryRepository: CategorySequelizeRepository;
  let createCategoryUseCase: CreateCategoryUseCase;

  beforeEach(() => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
  });

  it("should be able to create a category passing only required parameters", async () => {
    const output = await createCategoryUseCase.execute({ name: "test" });
    const entity = await categoryRepository.findById(output.id);
    expect(output).toStrictEqual({
      id: entity.id,
      name: entity.name,
      description: null,
      is_active: true,
      created_at: entity.created_at,
    });
  });

  it("should be able to create a category with all parameters.", async () => {
    const output = await createCategoryUseCase.execute({
      name: "test",
      description: "description",
      is_active: false,
    });
    const entity = await categoryRepository.findById(output.id);

    expect(output).toStrictEqual({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.isActive,
      created_at: entity.created_at,
    });
  });
});
