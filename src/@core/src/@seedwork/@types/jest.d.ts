import { FieldsErrors } from "@seedwork/validators/validator-fields-interface";

declare global {
  namespace jest {
    interface Matchers<R> {
      containsErrorMessages: (received: FieldsErrors) => R;
    }
  }
}

export {};
