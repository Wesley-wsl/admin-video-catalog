import UniqueEntityId from "../../../@seedwork/domain/unique-entity-id.vo";

export interface ICategoryProperties {
  id?: UniqueEntityId;
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
}

export class Category {
  constructor(private readonly props: ICategoryProperties) {
    this.props.id = this.props.id || new UniqueEntityId();
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
