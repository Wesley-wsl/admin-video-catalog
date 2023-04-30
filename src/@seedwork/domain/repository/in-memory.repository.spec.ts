import Entity from "../entity/entity";
import NotFoundError from "../errors/not-found.error";
import UniqueEntityId from "../value-objects/unique-entity-id/unique-entity-id.vo";
import InMemoryRepository from "./in-memory.repository";

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}
class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe("InMemoryRepository Unit Tests", () => {
  let repository: StubInMemoryRepository;
  beforeEach(() => (repository = new StubInMemoryRepository()));

  it("should insert a new entity", async () => {
    const entity = new StubEntity({ name: "name value", price: 5 });
    await repository.insert(entity);
    expect(entity.toJSON()).toStrictEqual(repository.items[0].toJSON());
  });

  it("should throw a error when entity not found", async () => {
    expect(repository.findById("fake id")).rejects.toThrow(
      new NotFoundError("Entity Not Found using ID fake id")
    );

    const uniqueEntityId = new UniqueEntityId();

    expect(repository.findById(uniqueEntityId.value)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${uniqueEntityId.value}`)
    );
  });

  it("should find a entity by id", async () => {
    const entity = new StubEntity({ name: "name value", price: 5 });
    await repository.insert(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

    entityFound = await repository.findById(
      new UniqueEntityId(entity.id).value
    );
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should find all", async () => {
    const entity = new StubEntity({ name: "name value", price: 5 });
    await repository.insert(entity);

    const entities = await repository.findAll();
    expect(entities).toStrictEqual([entity]);
  });

  it("should throw error on update when entity not found", async () => {
    const entity = new StubEntity({ name: "name value", price: 5 });
    expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${entity.id}`)
    );
  });

  it("should throw error on delete when entity not found", async () => {
    expect(repository.delete("fake id")).rejects.toThrow(
      new NotFoundError("Entity Not Found using ID fake id")
    );

    const uniqueEntityId = new UniqueEntityId();

    expect(repository.delete(uniqueEntityId.value)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${uniqueEntityId.value}`)
    );
  });

  it("should update an entity", async () => {
    const entity = new StubEntity({ name: "name value", price: 5 });
    await repository.insert(entity);
    entity.props.price = 55;
    await repository.update(entity);
    expect(repository.items[0].props.price).toEqual(entity.props.price);
  });

  it("should delete an entity", async () => {
    const entity = new StubEntity({ name: "name value", price: 5 });
    await repository.insert(entity);
    await repository.delete(entity.id);
    expect(repository.items).toHaveLength(0);

    await repository.insert(entity);
    await repository.delete(new UniqueEntityId(entity.id));
    expect(repository.items).toHaveLength(0);
  });
});
