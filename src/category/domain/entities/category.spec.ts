import { Category, ICategoryProperties } from "./category";
import { validate as uuidValidate } from "uuid";
import UniqueEntityId from "../../../@seedwork/domain/unique-entity-id.vo";

const props: ICategoryProperties = {
  id: new UniqueEntityId(),
  name: "Movie",
  description: "Description",
  is_active: true,
  created_at: new Date(),
};

describe("Category Unit Tests", () => {
  it("Should create a category with all properties", () => {
    const category = new Category(props);
    expect(category.allProps).toStrictEqual(props);
  });

  it("Should create a category with name and description", () => {
    const category = new Category({
      name: props.name,
      description: props.description,
    });

    expect(category.name).toEqual(props.name);
    expect(category.description).toEqual(props.description);
  });

  it("Should create a category with name and is_active", () => {
    const category = new Category({
      name: props.name,
      is_active: props.is_active,
    });

    expect(category.name).toEqual(props.name);
    expect(category.isActive).toEqual(props.is_active);
  });

  it("Should create a category with name and create_at", () => {
    const category = new Category({
      name: props.name,
      created_at: props.created_at,
    });

    expect(category.name).toEqual(props.name);
    expect(category.created_at).toEqual(props.created_at);
  });

  it("Should create a category without properties optional", () => {
    const category = new Category({
      name: props.name,
    });

    expect(category.name).toEqual(props.name);
    expect(category.description).toEqual(null);
    expect(category.isActive).toEqual(true);
    expect(category.created_at).toBeInstanceOf(Date);
  });
});
