import { CategoryModel } from "../category-model";
import { CategoryModelMapper } from "../category-mapper";
import { LoadEntityError } from "#seedwork/domain";
import { Category } from "#category/domain";
import UniqueEntityId from "#seedwork/domain/value-objects/unique-entity-id/unique-entity-id.vo";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

describe("CategoryModel Integration Tests", () => {
  setupSequelize({ models: [CategoryModel] });

  it("should throws error whe category is invalid", () => {
    const model = CategoryModel.build({
      id: "ac610bb3-3c0d-4a27-b799-a3f44c67f786",
    });

    try {
      CategoryModelMapper.toEntity(model);
      fail("The category is valid, but must throw a LoadEntityError");
    } catch (e) {
      expect(e).toBeInstanceOf(LoadEntityError);
      expect(e.error).toMatchObject({
        name: [
          "name must be a string",
          "name should not be empty",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    }
  });

  it("should throw a generic error", () => {
    const spyValidate = jest
      .spyOn(Category, "validate")
      .mockImplementation(() => {
        throw new Error("Generic Error");
      });

    const model = CategoryModel.build({
      id: "ac610bb3-3c0d-4a27-b799-a3f44c67f786",
    });

    expect(() => CategoryModelMapper.toEntity(model)).toThrow(
      new Error("Generic Error")
    );
    expect(spyValidate).toBeCalled();
    spyValidate.mockRestore();
  });

  it("should convert a category model to a category entity", () => {
    const created_at = new Date();
    const id = "ac610bb3-3c0d-4a27-b799-a3f44c67f786";
    const model = CategoryModel.build({
      id,
      name: "some value",
      description: "some description",
      is_active: true,
      created_at,
    });

    const entity = CategoryModelMapper.toEntity(model);
    expect(entity.toJSON()).toStrictEqual(
      new Category(
        {
          name: "some value",
          description: "some description",
          is_active: true,
          created_at,
        },
        new UniqueEntityId(id)
      ).toJSON()
    );
  });
});
