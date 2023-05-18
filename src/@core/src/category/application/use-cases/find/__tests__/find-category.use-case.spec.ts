import NotFoundError from "../../../../../@seedwork/domain/errors/not-found.error";
import { Category } from "../../../../domain/entities/category";
import { CategoryInMemoryRepository } from "../../../../infra/repository/category-in-memory.repository";
import { FindCategoryUseCase } from "../find-category.use-case";

describe("CreateCategoryUseCase Unit Tests", () => {
  let categoryInMemoryRepository: CategoryInMemoryRepository;
  let findCategoryUseCase: FindCategoryUseCase;

  beforeEach(() => {
    categoryInMemoryRepository = new CategoryInMemoryRepository();
    findCategoryUseCase = new FindCategoryUseCase(categoryInMemoryRepository);
  });

  it("should throw error when category is not found", () => {
    expect(() =>
      findCategoryUseCase.execute({ id: "fake_id" })
    ).rejects.toThrow(new NotFoundError(`Entity Not Found using ID fake_id`));
  });

  it("should be able to find a category by id.", async () => {
    const newCategory = new Category({ name: "ok" });
    categoryInMemoryRepository.items[0] = newCategory;
    const spyFindByIdMethod = jest.spyOn(
      categoryInMemoryRepository,
      "findById"
    );
    const output = await findCategoryUseCase.execute({ id: newCategory.id });

    expect(spyFindByIdMethod).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: categoryInMemoryRepository.items[0].id,
      name: "ok",
      description: null,
      is_active: true,
      created_at: categoryInMemoryRepository.items[0].created_at,
    });
  });
});
