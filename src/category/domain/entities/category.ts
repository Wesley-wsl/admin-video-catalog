import Entity from "../../../@seedwork/domain/entity/entity";
import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id/unique-entity-id.vo";

export interface ICategoryProperties {
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
}

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
}
