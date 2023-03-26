import Entity from "../../../@seedwork/domain/entity/entity";
import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id/unique-entity-id.vo";
import { ICategoryProperties, ICategoryUpdate } from "./category.interface";

export class Category extends Entity<ICategoryProperties> {
  constructor(public readonly props: ICategoryProperties, id?: UniqueEntityId) {
    super(props, id);
    this.props.description = this.props.description ?? null;
    this.props.is_active = this.props.is_active ?? true;
    this.props.created_at = this.props.created_at ?? new Date();
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get isActive() {
    return this.props.is_active;
  }

  get created_at() {
    return this.props.created_at;
  }

  get allProps() {
    return this.props;
  }

  update({ name, description }: ICategoryUpdate) {
    this.props.name = name;
    this.props.description = description;
  }

  activate() {
    this.props.is_active = true;
  }

  deactivate() {
    this.props.is_active = false;
  }
}
