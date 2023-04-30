import Entity from "../entity/entity";
import NotFoundError from "../errors/not-found.error";
import UniqueEntityId from "../value-objects/unique-entity-id/unique-entity-id.vo";
import { IRepository } from "./repository-contract";

export default abstract class InMemoryRepository<E extends Entity>
  implements IRepository<E>
{
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async findById(id: string | UniqueEntityId): Promise<E> {
    const _id = `${id}`;
    const item = await this._get(_id);
    return item;
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

  async update(entity: E): Promise<void> {
    await this._get(entity.id);
    const index = this.items.findIndex((i) => i.id === entity.id);
    this.items[index] = entity;
  }

  async delete(id: string | UniqueEntityId): Promise<void> {
    const _id = `${id}`;
    await this._get(_id);
    const index = this.items.findIndex((i) => i.id === id);
    this.items.splice(index, 1);
  }

  protected async _get(id: string): Promise<E> {
    const item = this.items.find((item) => item.id === id);
    if (!item) throw new NotFoundError(`Entity Not Found using ID ${id}`);
    return item;
  }
}
