import { ICategoryProperties } from "../entities/category.interface";
import CategoryValidatorFactory, {
  CategoryRules,
  CategoryValidator,
} from "./category.validator";

describe("CategoryValidator Tests", () => {
  let validator: CategoryValidator;

  beforeEach(() => (validator = CategoryValidatorFactory.create()));
  test("invalidation cases for name field", () => {
    expect({ validator, data: null }).containsErrorMessages({
      name: [
        "name must be a string",
        "name should not be empty",
        "name must be shorter than or equal to 255 characters",
      ],
    });

    expect({ validator, data: { name: "" } }).containsErrorMessages({
      name: ["name should not be empty"],
    });

    expect({ validator, data: { name: 5 } }).containsErrorMessages({
      name: [
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });

    expect({
      validator,
      data: { name: "t".repeat(256) },
    }).containsErrorMessages({
      name: ["name must be shorter than or equal to 255 characters"],
    });
  });

  test("invalidation cases for description field", () => {
    expect({
      validator,
      data: { description: 5 },
    }).containsErrorMessages({
      description: ["description must be a string"],
    });
  });

  test("invalidation cases for is_active field", () => {
    expect({
      validator,
      data: { is_active: 5 },
    }).containsErrorMessages({
      is_active: ["is_active must be a boolean value"],
    });
  });

  test("valid cases for fields", () => {
    const arrange: ICategoryProperties[] = [
      { name: "some value" },
      { name: "some value", description: undefined },
      { name: "some value", description: null },
      { name: "some value", is_active: false },
      { name: "some value", is_active: true },
    ];

    arrange.forEach((item) => {
      const isValid = validator.validate(item);
      expect(isValid).toBeTruthy();
      expect(validator.validatedData).toStrictEqual(new CategoryRules(item));
    });
  });
});
