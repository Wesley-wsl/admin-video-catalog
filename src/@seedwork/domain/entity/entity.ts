import UniqueEntityId from "../value-objects/unique-entity-id/unique-entity-id.vo";

export default abstract class Entity<Props = any> {
  public readonly uniqueEntityId: UniqueEntityId;

  constructor(public readonly props: Props, id?: UniqueEntityId) {
    this.uniqueEntityId = id || new UniqueEntityId();
  }

  get id() {
    return this.uniqueEntityId.value;
  }

  toJSON(): Required<{ id: string } & Props> {
    return {
      ...this.props,
      id: this.id,
    } as Required<{ id: string } & Props>;
  }
}
