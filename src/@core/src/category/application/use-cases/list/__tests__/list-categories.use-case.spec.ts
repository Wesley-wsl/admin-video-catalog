import { SearchResult } from "../../../../../@seedwork/domain/repository/repository-contract";
import { Category } from "../../../../domain/entities/category";
import { CategoryInMemoryRepository } from "../../../../infra/repository/category-in-memory.repository";
import { ListCategoriesUseCase } from "../list-categories.use-case";

describe("CreateCategoryUseCase Unit Tests", () => {
  let categoryInMemoryRepository: CategoryInMemoryRepository;
  let listCategoriesUseCase: ListCategoriesUseCase;

  beforeEach(() => {
    categoryInMemoryRepository = new CategoryInMemoryRepository();
    listCategoriesUseCase = new ListCategoriesUseCase(
      categoryInMemoryRepository
    );
  });

  it("should be able to list categories using filter, sort and pagination.", async () => {
    const categories = [
      new Category({ name: "ok" }),
      new Category({ name: "Test" }),
      new Category({ name: "test2" }),
    ];
    categoryInMemoryRepository.items = categories;
    const spySeachMethod = jest.spyOn(categoryInMemoryRepository, "search");
    const result = await listCategoriesUseCase.execute({
      filter: "test",
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "asc",
    });
    const resultToCompare = new SearchResult({
      items: [categories[1], categories[2]],
      total: 2,
      current_page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "asc",
      filter: "test",
    });

    expect(spySeachMethod).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(resultToCompare);
  });

  it("should be able to list categories without pass parameters.", async () => {
    const categories = [
      new Category({ name: "ok" }),
      new Category({ name: "Test" }),
      new Category({ name: "test2" }),
    ];
    categoryInMemoryRepository.items = categories;
    const spySeachMethod = jest.spyOn(categoryInMemoryRepository, "search");
    const result = await listCategoriesUseCase.execute({});
    const resultToCompare = new SearchResult({
      items: categories,
      total: 3,
      current_page: 1,
      per_page: 15,
      sort: null,
      sort_dir: null,
      filter: null,
    });

    expect(spySeachMethod).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(resultToCompare);
  });
});
