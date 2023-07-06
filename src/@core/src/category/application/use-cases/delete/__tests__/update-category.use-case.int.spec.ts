import { CategoryModel } from "#category/infra/db/sequelize/category-model";
import { CategorySequelizeRepository } from "#category/infra/db/sequelize/category-repository";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import NotFoundError from "../../../../../@seedwork/domain/errors/not-found.error";
import { DeleteCategoryUseCase } from "../delete-category.use-case";

describe("CreateCategoryUseCase Integration Tests", () => {
  setupSequelize({ models: [CategoryModel] });
  let categoryRepository: CategorySequelizeRepository;
  let deleteCategoryUseCase: DeleteCategoryUseCase;

  beforeEach(() => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);
  });

  it("should throw error when category is not found.", async () => {
    await expect(() =>
      deleteCategoryUseCase.execute({ id: "fake" })
    ).rejects.toThrow(new NotFoundError("Entity Not Found using ID fake"));
  });

  it("should be able to delete a category with success.", async () => {
    const model = await CategoryModel.factory().create();
    await deleteCategoryUseCase.execute({
      id: model.id,
    });

    const noHasModel = await CategoryModel.findByPk(model.id);
    expect(noHasModel).toBeNull();
  });
});
