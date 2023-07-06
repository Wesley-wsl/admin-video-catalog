import { Category } from "./category";

describe("Category Integration Tests", () => {
  describe("create method", () => {
    it("should throw errors about validation in category using name property", () => {
      const arrange = [
        {
          value: null,
          error: {
            name: [
              "name must be a string",
              "name should not be empty",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          value: "",
          error: {
            name: ["name should not be empty"],
          },
        },
        {
          value: 2,
          error: {
            name: [
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          value: "t".repeat(256),
          error: {
            name: ["name must be shorter than or equal to 255 characters"],
          },
        },
      ];

      arrange.forEach(({ value, error }) => {
        expect(
          () => new Category({ name: value as any })
        ).containsErrorMessages(error);
      });
    });

    it("should throw errors about validation in category using description property", () => {
      const arrange = [
        { value: 1, error: { description: ["description must be a string"] } },
      ];

      arrange.forEach(({ value, error }) => {
        expect(
          () => new Category({ name: "movie", description: value as any })
        ).containsErrorMessages(error);
      });
    });

    it("should throw errors about validation in category using is_active property", () => {
      const arrange = [
        {
          value: "true",
          error: { is_active: ["The is_active must be a boolean."] },
        },
      ];

      arrange.forEach(({ value, error }) => {
        expect(
          () => new Category({ name: "movie", is_active: value as any })
        ).containsErrorMessages(error);
      });
    });
  });

  describe("update method", () => {
    it("should throw errors about validation in category using name property during the update method", () => {
      const category = new Category({
        name: "Hello",
        description: "Hello",
        is_active: true,
      });

      const arrange = [
        {
          value: null,
          error: {
            name: [
              "name must be a string",
              "name should not be empty",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          value: "",
          error: {
            name: ["name should not be empty"],
          },
        },
        {
          value: 2,
          error: {
            name: [
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          value: "t".repeat(256),
          error: {
            name: ["name must be shorter than or equal to 255 characters"],
          },
        },
      ];

      arrange.forEach(({ value, error }) => {
        expect(() =>
          category.update({ name: value as any, description: "Hello" })
        ).containsErrorMessages(error);
      });
    });

    it("should throw errors about validation in category using description property during the update method", () => {
      const category = new Category({
        name: "Hello",
        description: "Hello",
        is_active: true,
      });

      const arrange = [
        { value: 1, error: { description: ["description must be a string"] } },
      ];

      arrange.forEach(({ value, error }) => {
        expect(() =>
          category.update({ name: "movie", description: value as any })
        ).containsErrorMessages(error);
      });
    });
  });
});
