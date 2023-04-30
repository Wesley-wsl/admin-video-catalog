import { Category } from "./category";
import { ICategoryProperties } from "./category.interface";

const props: ICategoryProperties = {
  name: "Movie",
  description: "Description",
  is_active: true,
  created_at: new Date(),
};

describe("Category Unit Tests", () => {
  const validateMethod = (Category.validate = jest.fn());
  it("Should create a category with all properties", () => {
    const category = new Category(props);
    expect(validateMethod).toHaveBeenCalledTimes(1);
    expect(category.allProps).toStrictEqual(props);
  });

  it("Should create a category with name and description", () => {
    const category = new Category({
      name: props.name,
      description: props.description,
    });
    expect(validateMethod).toHaveBeenCalledTimes(1);
    expect(category.name).toEqual(props.name);
    expect(category.description).toEqual(props.description);
  });

  it("Should create a category with name and is_active", () => {
    const category = new Category({
      name: props.name,
      is_active: props.is_active,
    });
    expect(validateMethod).toHaveBeenCalledTimes(1);
    expect(category.name).toEqual(props.name);
    expect(category.isActive).toEqual(props.is_active);
  });

  it("Should create a category with name and create_at", () => {
    const category = new Category({
      name: props.name,
      created_at: props.created_at,
    });
    expect(validateMethod).toHaveBeenCalledTimes(1);
    expect(category.name).toEqual(props.name);
    expect(category.created_at).toEqual(props.created_at);
  });

  it("Should create a category without properties optional", () => {
    const category = new Category({
      name: props.name,
    });
    expect(validateMethod).toHaveBeenCalledTimes(1);
    expect(category.name).toEqual(props.name);
    expect(category.description).toEqual(null);
    expect(category.isActive).toEqual(true);
    expect(category.created_at).toBeInstanceOf(Date);
  });

  it("should update name and description of category", () => {
    const arrange = {
      name: "name",
      description: "description",
      is_active: true,
    };
    const category = new Category(arrange);
    expect(category.name).toEqual(arrange.name);
    expect(category.description).toEqual(arrange.description);

    const newProperties = {
      name: "name2",
      description: "description2",
    };

    category.update(newProperties);
    expect(validateMethod).toHaveBeenCalledTimes(2);
    expect(category.name).toEqual(newProperties.name);
    expect(category.description).toEqual(newProperties.description);
  });

  it("should activate and deactivate category", () => {
    const arrange = {
      name: "name",
      description: "description",
      is_active: true,
    };
    const category = new Category(arrange);
    expect(validateMethod).toHaveBeenCalledTimes(1);
    expect(category.isActive).toEqual(true);

    category.deactivate();
    expect(category.isActive).toEqual(false);

    category.activate();
    expect(category.isActive).toEqual(true);
  });
});
