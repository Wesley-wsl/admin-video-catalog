import {
  Model,
  Table,
  Column,
  PrimaryKey,
  DataType,
} from "sequelize-typescript";
import { SequelizeModelFactory } from "./sequelize-model-factory";
import chance from "chance";
import { validate as uuidValidate } from "uuid";
import { setupSequelize } from "../testing/helpers/db";

@Table({})
class StubModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name;

  static mockFactory = jest.fn(() => ({
    id: chance().guid(),
    name: chance().name(),
  }));

  static factory() {
    return new SequelizeModelFactory<StubModel, { id: string; name: string }>(
      StubModel,
      StubModel.mockFactory
    );
  }
}

describe("SequelizeModelFactory Tests", () => {
  setupSequelize({ models: [StubModel] });

  test("create method", async () => {
    let model = await StubModel.factory().create();

    expect(uuidValidate(model.id)).toBeTruthy();
    expect(model.name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();
    let modelFound = await StubModel.findByPk(model.id);
    expect(model.id).toBe(modelFound.id);

    model = await StubModel.factory().create({
      id: "ac610bb3-3c0d-4a27-b799-a3f44c67f786",
      name: "test",
    });

    expect(model.id).toBe("ac610bb3-3c0d-4a27-b799-a3f44c67f786");
    expect(model.name).toBe("test");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

    modelFound = await StubModel.findByPk(model.id);
    expect(model.id).toBe(modelFound.id);
  });

  test("make method", async () => {
    let model = await StubModel.factory().make();

    expect(uuidValidate(model.id)).toBeTruthy();
    expect(model.name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();

    model = await StubModel.factory().make({
      id: "ac610bb3-3c0d-4a27-b799-a3f44c67f786",
      name: "test",
    });

    expect(model.id).toBe("ac610bb3-3c0d-4a27-b799-a3f44c67f786");
    expect(model.name).toBe("test");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
  });

  test("bulkCreate method using count = 1", async () => {
    let models = await StubModel.factory().bulkCreate();
    expect(models).toHaveLength(1);
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();

    let modelFound = await StubModel.findByPk(models[0].id);
    expect(models[0].id).toBe(modelFound.id);
    expect(models[0].name).toBe(modelFound.name);

    models = await StubModel.factory().bulkCreate(() => ({
      id: "ac610bb3-3c0d-4a27-b799-a3f44c67f786",
      name: "test",
    }));

    expect(models[0].id).toBe("ac610bb3-3c0d-4a27-b799-a3f44c67f786");
    expect(models[0].name).toBe("test");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

    modelFound = await StubModel.findByPk(models[0].id);
    expect(models[0].id).toBe(modelFound.id);
  });

  test("bulkCreate method using count > 1", async () => {
    let models = await StubModel.factory().count(2).bulkCreate();
    expect(models).toHaveLength(2);
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();
    expect(models[1].id).not.toBeNull();
    expect(models[1].name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();

    let modelFound1 = await StubModel.findByPk(models[0].id);
    let modelFound2 = await StubModel.findByPk(models[1].id);
    expect(models[0].id).toBe(modelFound1.id);
    expect(models[0].name).toBe(modelFound1.name);
    expect(models[1].id).toBe(modelFound2.id);
    expect(models[1].name).toBe(modelFound2.name);

    models = await StubModel.factory()
      .count(2)
      .bulkCreate(() => ({
        id: chance().guid(),
        name: "test",
      }));

    expect(models[0].id).not.toBeNull();
    expect(models[0].name).toBe("test");
    expect(models[1].id).not.toBeNull();
    expect(models[1].name).toBe("test");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);

    modelFound1 = await StubModel.findByPk(models[0].id);
    modelFound2 = await StubModel.findByPk(models[1].id);
    expect(models[0].name).toBe(modelFound1.name);
    expect(models[0].name).toBe(modelFound2.name);
  });

  test("bulkMake method using count = 1", async () => {
    let models = await StubModel.factory().bulkMake();
    expect(models).toHaveLength(1);
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();

    models = StubModel.factory().bulkMake(() => ({
      id: "ac610bb3-3c0d-4a27-b799-a3f44c67f786",
      name: "test",
    }));

    expect(models[0].id).toBe("ac610bb3-3c0d-4a27-b799-a3f44c67f786");
    expect(models[0].name).toBe("test");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
  });

  test("bulkMake method using count > 1", async () => {
    let models = StubModel.factory().count(2).bulkMake();
    expect(models).toHaveLength(2);
    expect(models[0].id).not.toBeNull();
    expect(models[0].name).not.toBeNull();
    expect(models[1].id).not.toBeNull();
    expect(models[1].name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();

    models = await StubModel.factory()
      .count(2)
      .bulkMake(() => ({
        id: chance().guid(),
        name: "test",
      }));

    expect(models[0].id).not.toBeNull();
    expect(models[0].name).toBe("test");
    expect(models[1].id).not.toBeNull();
    expect(models[1].name).toBe("test");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);
  });
});
