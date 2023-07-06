import { CategoryModel } from "#category/infra/db/sequelize/category-model";
import { CategorySequelizeRepository } from "#category/infra/db/sequelize/category-repository";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { SearchResult } from "../../../../../@seedwork/domain/repository/repository-contract";
import { Category } from "../../../../domain/entities/category";
import { ListCategoriesUseCase } from "../list-categories.use-case";

describe("CreateCategoryUseCase Integration Tests", () => {
  setupSequelize({ models: [CategoryModel] });

  let categoryRepository: CategorySequelizeRepository;
  let listCategoriesUseCase: ListCategoriesUseCase;

  beforeEach(() => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    listCategoriesUseCase = new ListCategoriesUseCase(categoryRepository);
  });

  it("should be able to list categories using filter, sort and pagination.", async () => {
    const categories = [
      new Category({ name: "ok" }),
      new Category({ name: "Test" }),
      new Category({ name: "test2" }),
    ];

    await categoryRepository.insert(categories[0]);
    await categoryRepository.insert(categories[1]);
    await categoryRepository.insert(categories[2]);

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

    expect({ ...result, items: undefined }).toStrictEqual({
      ...resultToCompare,
      items: undefined,
    });
    expect(result.items[0].name).toEqual(resultToCompare.items[0].name);
    expect(result.items[1].name).toEqual(resultToCompare.items[1].name);
  });

  it("should be able to list categories without pass parameters.", async () => {
    const categories = [
      new Category({ name: "ok" }),
      new Category({ name: "Test" }),
      new Category({ name: "test2" }),
    ];

    await categoryRepository.insert(categories[0]);
    await categoryRepository.insert(categories[1]);
    await categoryRepository.insert(categories[2]);

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

    expect({ ...result, items: undefined }).toStrictEqual({
      ...resultToCompare,
      items: undefined,
    });
    expect(result.items[0].name).toEqual(resultToCompare.items[0].name);
    expect(result.items[1].name).toEqual(resultToCompare.items[1].name);
    expect(result.items[2].name).toEqual(resultToCompare.items[2].name);
  });
});
