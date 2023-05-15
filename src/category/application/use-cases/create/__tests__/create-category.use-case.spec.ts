import { CategoryInMemoryRepository } from "../../../../infra/repository/category-in-memory.repository";
import { CreateCategoryUseCase } from "../create-category.use-case";

describe("CreateCategoryUseCase Unit Tests", () => {
  let categoryInMemoryRepository: CategoryInMemoryRepository;
  let createCategoryUseCase: CreateCategoryUseCase;

  beforeEach(() => {
    categoryInMemoryRepository = new CategoryInMemoryRepository();
    createCategoryUseCase = new CreateCategoryUseCase(
      categoryInMemoryRepository
    );
  });

  it("should be able to create a category passing only required parameters", async () => {
    const spyInsertMethod = jest.spyOn(categoryInMemoryRepository, "insert");
    const output = await createCategoryUseCase.execute({ name: "test" });

    expect(spyInsertMethod).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: categoryInMemoryRepository.items[0].id,
      name: "test",
      description: null,
      is_active: true,
      created_at: categoryInMemoryRepository.items[0].created_at,
    });
  });

  it("should be able to create a category with all parameters.", async () => {
    const spyInsertMethod = jest.spyOn(categoryInMemoryRepository, "insert");
    const output = await createCategoryUseCase.execute({
      name: "test",
      description: "description",
      is_active: false,
    });

    expect(spyInsertMethod).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: categoryInMemoryRepository.items[0].id,
      name: "test",
      description: "description",
      is_active: false,
      created_at: categoryInMemoryRepository.items[0].created_at,
    });
  });
});
