import { Category } from "../../../domain/entities/category";
import { CategoryInMemoryRepository } from "./category-in-memory.repository";

describe("CategoryInMemoryRepository Unit Tests", () => {
  let categoryInMemoryRepository: CategoryInMemoryRepository;

  beforeEach(
    () => (categoryInMemoryRepository = new CategoryInMemoryRepository())
  );

  describe("applyFilter", () => {
    it("should be able to filter category by name correctly", async () => {
      const items = [
        new Category({ name: "random" }),
        new Category({ name: "test" }),
      ];

      const result = await categoryInMemoryRepository["applyFilter"](
        items,
        "random"
      );

      expect(result).toStrictEqual([items[0]]);
    });

    it("shouldn't be able to filter if don't pass filter parameter.", async () => {
      const items = [
        new Category({ name: "random" }),
        new Category({ name: "test" }),
      ];

      const result = await categoryInMemoryRepository["applyFilter"](
        items,
        null
      );

      expect(result).toStrictEqual(items);
    });
  });

  describe("applySort", () => {
    const items = [
      new Category({ name: "random", created_at: new Date("2024-02-02") }),
      new Category({ name: "test", created_at: new Date("2022-02-02") }),
    ];
    it("should be able to sort category correctly", async () => {
      let itemsOrdered = await categoryInMemoryRepository["applySort"](
        items,
        "name",
        "desc"
      );

      expect(itemsOrdered).toStrictEqual([items[1], items[0]]);
    });

    it("shouldn't be able to sort category by created_at when not pass sort parameter.", async () => {
      let itemsOrdered = await categoryInMemoryRepository["applySort"](
        items,
        null,
        null
      );

      expect(itemsOrdered).toStrictEqual([items[1], items[0]]);
    });
  });
});
