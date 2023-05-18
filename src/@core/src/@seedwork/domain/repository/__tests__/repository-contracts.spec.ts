import { SearchParams, SearchResult } from "../repository-contract";

describe("Search Unit Tests", () => {
  describe("SearchParams Unit Tests", () => {
    test("page prop", () => {
      const params = new SearchParams();
      expect(params.page).toEqual(1);

      const arrange: any = [
        { page: null, expected: 1 },
        { page: undefined, expected: 1 },
        { page: "", expected: 1 },
        { page: "fake", expected: 1 },
        { page: 0, expected: 1 },
        { page: -1, expected: 1 },
        { page: 5.5, expected: 1 },
        { page: true, expected: 1 },
        { page: {}, expected: 1 },
        { page: 1, expected: 1 },
        { page: 2, expected: 2 },
      ];

      arrange.forEach((i: any) => {
        expect(new SearchParams({ page: i.page }).page).toBe(i.expected);
      });
    });

    test("per_page prop", () => {
      const params = new SearchParams();
      expect(params.per_page).toEqual(15);

      const arrange: any = [
        { per_page: null, expected: 15 },
        { per_page: undefined, expected: 15 },
        { per_page: "", expected: 15 },
        { per_page: "fake", expected: 15 },
        { per_page: 0, expected: 15 },
        { per_page: -1, expected: 15 },
        { per_page: 5.5, expected: 15 },
        { per_page: true, expected: 15 },
        { per_page: {}, expected: 15 },
        { per_page: 1, expected: 1 },
      ];

      arrange.forEach((i: any) => {
        expect(new SearchParams({ per_page: i.per_page }).per_page).toBe(
          i.expected
        );
      });
    });

    test("sort prop", () => {
      const params = new SearchParams();
      expect(params.sort).toBeNull();

      const arrange: any = [
        { sort: null, expected: null },
        { sort: undefined, expected: null },
        { sort: "", expected: null },
        { sort: "fake", expected: "fake" },
        { sort: 0, expected: null },
        { sort: -1, expected: "-1" },
        { sort: 5.5, expected: "5.5" },
        { sort: true, expected: "true" },
        { sort: false, expected: null },
        { sort: {}, expected: "[object Object]" },
        { sort: "field", expected: "field" },
      ];

      arrange.forEach((i: any) => {
        expect(new SearchParams({ sort: i.sort }).sort).toBe(i.expected);
      });
    });

    test("sort_dir prop", () => {
      const params = new SearchParams({ sort: null });
      expect(params.sort_dir).toBeNull();

      const arrange: any = [
        { sort_dir: null, expected: "asc" },
        { sort_dir: undefined, expected: "asc" },
        { sort_dir: "", expected: "asc" },
        { sort_dir: 0, expected: "asc" },
        { sort_dir: "fake", expected: "asc" },
        { sort_dir: "asc", expected: "asc" },
        { sort_dir: "ASC", expected: "asc" },
        { sort_dir: "desc", expected: "desc" },
        { sort_dir: "DESC", expected: "desc" },
      ];

      arrange.forEach((i: any) => {
        expect(
          new SearchParams({ sort: "field", sort_dir: i.sort_dir }).sort_dir
        ).toBe(i.expected);
      });
    });

    test("filter prop", () => {
      const params = new SearchParams();
      expect(params.filter).toBeNull();

      const arrange: any = [
        { filter: null, expected: null },
        { filter: undefined, expected: null },
        { filter: "", expected: null },
        { filter: "fake", expected: "fake" },
        { filter: 0, expected: null },
        { filter: -1, expected: "-1" },
        { filter: 5.5, expected: "5.5" },
        { filter: true, expected: "true" },
        { filter: "field", expected: "field" },
      ];

      arrange.forEach((i: any) => {
        expect(new SearchParams({ filter: i.filter }).filter).toBe(i.expected);
      });
    });
  });

  describe("SearchResult Unit Tests", () => {
    test("constructor props", () => {
      let result = new SearchResult({
        items: ["entity1", "entity2"] as any,
        total: 4,
        current_page: 1,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: null,
      });
      expect(result.toJSON()).toStrictEqual({
        items: ["entity1", "entity2"] as any,
        total: 4,
        current_page: 1,
        last_page: 2,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: null,
      });

      result = new SearchResult({
        items: ["entity1", "entity2"] as any,
        total: 4,
        current_page: 1,
        per_page: 2,
        sort: "name",
        sort_dir: "asc",
        filter: "test",
      });
      expect(result.toJSON()).toStrictEqual({
        items: ["entity1", "entity2"] as any,
        total: 4,
        current_page: 1,
        last_page: 2,
        per_page: 2,
        sort: "name",
        sort_dir: "asc",
        filter: "test",
      });
    });

    test("should set last_page = 1 when per_page field is greater than total field", () => {
      let result = new SearchResult({
        items: ["entity1", "entity2"] as any,
        total: 4,
        current_page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      });
      expect(result.last_page).toBe(1);
    });

    it("last_page prop when total is not a multiple of per_page", () => {
      let result = new SearchResult({
        items: ["entity1", "entity2"] as any,
        total: 101,
        current_page: 1,
        per_page: 20,
        sort: null,
        sort_dir: null,
        filter: null,
      });
      expect(result.last_page).toBe(6);
    });
  });
});
