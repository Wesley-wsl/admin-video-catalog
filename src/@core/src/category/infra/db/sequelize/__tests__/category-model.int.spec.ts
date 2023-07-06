import { DataType } from "sequelize-typescript";
import { CategoryModel } from "../category-model";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

describe("CategoryModel Integration Tests", () => {
  setupSequelize({ models: [CategoryModel] });

  it("mapping props", () => {
    const attributesMap = CategoryModel.getAttributes();
    const attributes = Object.keys(attributesMap);
    const arrange = [
      {
        received: attributesMap.id,
        expected: {
          primaryKey: true,
          field: "id",
          fieldName: "id",
          type: DataType.UUID(),
        },
      },
      {
        received: attributesMap.name,
        expected: {
          field: "name",
          fieldName: "name",
          allowNull: false,
          type: DataType.STRING(255),
        },
      },
      {
        received: attributesMap.description,
        expected: {
          field: "description",
          fieldName: "description",
          allowNull: true,
          type: DataType.TEXT(),
        },
      },
      {
        received: attributesMap.is_active,
        expected: {
          field: "is_active",
          fieldName: "is_active",
          allowNull: false,
          type: DataType.BOOLEAN(),
        },
      },
      {
        received: attributesMap.created_at,
        expected: {
          field: "created_at",
          fieldName: "created_at",
          allowNull: false,
          type: DataType.DATE(),
        },
      },
    ];

    arrange.forEach(({ received, expected }) => {
      expect(received).toMatchObject(expected);
    });

    expect(attributes).toStrictEqual([
      "id",
      "name",
      "description",
      "is_active",
      "created_at",
    ]);
  });

  it("create", async () => {
    const arrange = {
      id: "ac610bb3-3c0d-4a27-b799-a3f44c67f786",
      name: "Test",
      description: "test description",
      is_active: true,
      created_at: new Date(),
    };
    const category = await CategoryModel.create(arrange);

    expect(category.toJSON()).toStrictEqual(arrange);
  });
});
