import { FieldsErrors } from "#seedwork/validators/validator-fields-interface";

export default class ValidationError extends Error {}

export class EntityValidationError extends Error {
  constructor(public error: FieldsErrors) {
    super("Entity Validation Error");
    this.name = "EntityValidationError";
  }
}
