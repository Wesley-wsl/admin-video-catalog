import { CategoryModel } from "../category-model";
import { Category, CategoryRepository } from "#category/domain";
import { CategorySequelizeRepository } from "../category-repository";
import NotFoundError from "#seedwork/domain/errors/not-found.error";
import UniqueEntityId from "#seedwork/domain/value-objects/unique-entity-id/unique-entity-id.vo";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

import _chance from "chance";
import { CategoryModelMapper } from "../category-mapper";
const chance = _chance();
describe("CategorySequelizeRepository Integration Tests", () => {
  setupSequelize({ models: [CategoryModel] });
  let repository: CategorySequelizeRepository;

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  it("should inserts a category", async () => {
    let category = new Category({
      name: "Movie",
      description: "Movie Description",
      created_at: new Date(),
      is_active: true,
    });

    await repository.insert(category);
    const model = await CategoryModel.findByPk(category.id);
    expect(model.toJSON()).toStrictEqual(category.toJSON());
  });

  it("should throw a error when category is not found", async () => {
    await expect(repository.findById("fake id")).rejects.toThrow(
      new NotFoundError("Entity Not Found using ID fake id")
    );

    const uniqueEntityId = new UniqueEntityId();

    await expect(repository.findById(uniqueEntityId.value)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${uniqueEntityId.value}`)
    );
  });

  it("should find a category by id", async () => {
    const category = new Category({ name: "Movie" });

    await CategoryModel.create(category.toJSON());

    let categoryFound = await repository.findById(category.id);
    expect(category.toJSON()).toStrictEqual(categoryFound.toJSON());
  });

  it("should return all categories", async () => {
    const entity = new Category({ name: "Movie" });
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
  });

  it("should throw error on update when a entity not found.", async () => {
    const entity = new Category({ name: "Movie" });
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${entity.uniqueEntityId}`)
    );
  });

  it("should update a entity", async () => {
    const entity = new Category({ name: "Movie" });
    await repository.insert(entity);
    entity.update({ description: entity.description, name: "Movie updated" });
    await repository.update(entity);
    let entityFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should throw error on delete when a entity not found", async () => {
    await expect(repository.delete("fakeID")).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID fakeID`)
    );

    await expect(
      repository.delete("9366b7dc-2d71-4799-b91c-c64adb205104")
    ).rejects.toThrow(
      new NotFoundError(
        `Entity Not Found using ID 9366b7dc-2d71-4799-b91c-c64adb205104`
      )
    );
  });

  it("should delete a entity", async () => {
    const entity = new Category({ name: "Movie" });
    await repository.insert(entity);

    await repository.delete(entity.id);
    const entityFound = await CategoryModel.findByPk(entity.id);
    expect(entityFound).toBeNull();
  });

  describe("search method tests", () => {
    it("should only apply paginate when other params are null", async () => {
      const created_at = new Date();
      await CategoryModel.factory()
        .count(16)
        .bulkCreate(() => ({
          id: chance.guid({ version: 4 }),
          name: "Movie",
          description: null,
          is_active: true,
          created_at,
        }));
      const spyToEntity = jest.spyOn(CategoryModelMapper, "toEntity");
      const searchOutput = await repository.search(
        new CategoryRepository.SearchParams()
      );

      expect(searchOutput).toBeInstanceOf(CategoryRepository.SearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      });

      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Category);
        expect(item.id).toBeDefined();
      });
      const items = searchOutput.items.map((item) => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          name: "Movie",
          description: null,
          is_active: true,
          created_at,
        })
      );
    });

    it("should order by created_at DESC when search params are null", async () => {
      const created_at = new Date();
      await CategoryModel.factory()
        .count(16)
        .bulkCreate((index) => ({
          id: chance.guid({ version: 4 }),
          name: `Movie ${index}`,
          description: null,
          is_active: true,
          created_at: new Date(created_at.getTime() + 100 + index),
        }));
      const spyToEntity = jest.spyOn(CategoryModelMapper, "toEntity");
      const searchOutput = await repository.search(
        new CategoryRepository.SearchParams()
      );

      expect(spyToEntity).toHaveBeenCalledTimes(15);

      searchOutput.items.forEach((item, index) => {
        expect(`${item.name} ${index + 1}`);
      });
    });

    it("should apply paginate and filter", async () => {
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date(),
      };

      const categoriesProp = [
        {
          id: chance.guid({ version: 4 }),
          name: "test",
          price: 5,
          ...defaultProps,
        },
        {
          id: chance.guid({ version: 4 }),
          name: "a",
          price: 5,
          ...defaultProps,
        },
        {
          id: chance.guid({ version: 4 }),
          name: "TEST",
          price: 5,
          ...defaultProps,
        },
        {
          id: chance.guid({ version: 4 }),
          name: "TeST",
          price: 5,
          ...defaultProps,
        },
      ];

      const categories = await CategoryModel.bulkCreate(categoriesProp);

      let result = await repository.search(
        new CategoryRepository.SearchParams({
          page: 1,
          per_page: 2,
          filter: "TEST",
        })
      );

      expect(result.toJSON(true)).toMatchObject(
        new CategoryRepository.SearchResult({
          items: [
            CategoryModelMapper.toEntity(categories[0]),
            CategoryModelMapper.toEntity(categories[2]),
          ],
          total: 3,
          current_page: 1,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: "TEST",
        }).toJSON(true)
      );

      result = await repository.search(
        new CategoryRepository.SearchParams({
          page: 2,
          per_page: 2,
          filter: "TEST",
        })
      );

      expect(result.toJSON(true)).toMatchObject(
        new CategoryRepository.SearchResult({
          items: [CategoryModelMapper.toEntity(categories[3])],
          total: 3,
          current_page: 2,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: "TEST",
        }).toJSON(true)
      );
    });

    it("should apply paginate and sort", async () => {
      expect(repository.sortableFields).toStrictEqual(["name", "created_at"]);

      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date(),
      };

      const categoriesProp = [
        {
          id: chance.guid({ version: 4 }),
          name: "b",
          price: 5,
          ...defaultProps,
        },
        {
          id: chance.guid({ version: 4 }),
          name: "a",
          price: 5,
          ...defaultProps,
        },
        {
          id: chance.guid({ version: 4 }),
          name: "d",
          price: 5,
          ...defaultProps,
        },
        {
          id: chance.guid({ version: 4 }),
          name: "e",
          price: 5,
          ...defaultProps,
        },
        {
          id: chance.guid({ version: 4 }),
          name: "c",
          price: 5,
          ...defaultProps,
        },
      ];

      const categories = await CategoryModel.bulkCreate(categoriesProp);

      const arrange = [
        {
          params: new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
          }),
          result: new CategoryRepository.SearchResult({
            items: [
              CategoryModelMapper.toEntity(categories[1]),
              CategoryModelMapper.toEntity(categories[0]),
            ],
            total: 4,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: null,
          }),
        },
        {
          params: new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new CategoryRepository.SearchResult({
            items: [
              CategoryModelMapper.toEntity(categories[2]),
              CategoryModelMapper.toEntity(categories[3]),
            ],
            total: 4,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
            filter: null,
          }),
        },
      ];

      for (const i of arrange) {
        let result = await repository.search(i.params);
        expect(result.toJSON()).toMatchObject(i.result.toJSON());
      }
    });

    describe("should search using filter, paginate and sort.", () => {
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date(),
      };

      const categoriesProp = [
        {
          id: chance.guid({ version: 4 }),
          name: "test",
          ...defaultProps,
        },
        {
          id: chance.guid({ version: 4 }),
          name: "a",
          ...defaultProps,
        },
        {
          id: chance.guid({ version: 4 }),
          name: "TEST",
          ...defaultProps,
        },
        {
          id: chance.guid({ version: 4 }),
          name: "e",
          ...defaultProps,
        },
        {
          id: chance.guid({ version: 4 }),
          name: "TeSt",
          ...defaultProps,
        },
      ];

      const arrange = [
        {
          searchParams: new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),
          searchResult: new CategoryRepository.SearchResult({
            items: [
              new Category(
                categoriesProp[2],
                new UniqueEntityId(categoriesProp[2].id)
              ),
              new Category(
                categoriesProp[4],
                new UniqueEntityId(categoriesProp[4].id)
              ),
            ],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),
        },
        {
          searchParams: new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
            filter: "TEST",
          }),
          searchResult: new CategoryRepository.SearchResult({
            items: [
              new Category(
                categoriesProp[0],
                new UniqueEntityId(categoriesProp[0].id)
              ),
              new Category(
                categoriesProp[4],
                new UniqueEntityId(categoriesProp[4].id)
              ),
            ],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
            filter: "TEST",
          }),
        },
      ];

      beforeEach(async () => {
        await CategoryModel.bulkCreate(categoriesProp);
      });

      test.each(arrange)(
        "when value is %j",
        async ({ searchParams, searchResult }) => {
          let result = await repository.search(searchParams);
          expect(result.toJSON(true)).toMatchObject(searchResult.toJSON(true));
        }
      );
    });
  });
});
