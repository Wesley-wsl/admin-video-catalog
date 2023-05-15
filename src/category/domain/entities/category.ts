import Entity from "#seedwork/domain/entity/entity";
import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id/unique-entity-id.vo";
import { ICategoryProperties, ICategoryUpdate } from "./category.interface";
import CategoryValidatorFactory from "../validators/category.validator";
import { EntityValidationError } from "../../../@seedwork/domain/errors/validation-error";

export class Category extends Entity<ICategoryProperties> {
  constructor(public readonly props: ICategoryProperties, id?: UniqueEntityId) {
    Category.validate(props);
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
    Category.validate({ name, description });
  }

  activate() {
    this.props.is_active = true;
  }

  deactivate() {
    this.props.is_active = false;
  }

  static validate(props: Omit<ICategoryProperties, "created_at">) {
    const validator = CategoryValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) throw new EntityValidationError(validator.errors);
  }
}
