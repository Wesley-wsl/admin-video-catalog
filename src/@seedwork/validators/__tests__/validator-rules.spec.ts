import ValidationError from "../../domain/errors/validation-error";
import ValidatorRules from "../validator-rules";

type Values = {
  value: any;
  property: string;
};

type ExpectedRule = {
  value: any;
  property: string;
  rule: keyof ValidatorRules;
  error: ValidationError;
  params?: any[];
};

function runRule({
  value,
  property,
  rule,
  params = [],
}: Omit<ExpectedRule, "error">) {
  const validator = ValidatorRules.values(value, property);
  const method = validator[rule];
  method.apply.bind(method, validator)(params);
}

function assertIsInvalid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected);
  }).toThrow(expected.error);
}

function assertIsValid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected);
  }).not.toThrow(expected.error);
}

describe("ValidatorRules Unit Tests", () => {
  test("values method", () => {
    const validator = ValidatorRules.values("some value", "field");
    expect(validator).toBeInstanceOf(ValidatorRules);
    expect(validator["value"]).toBe("some value");
    expect(validator["property"]).toBe("field");
  });

  test("required validation method", () => {
    let arrange: Values[] = [
      { value: null, property: "field" },
      { value: undefined, property: "field" },
      { value: "", property: "field" },
    ];

    arrange.forEach((item: any) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "required",
        error: new ValidationError("The field is required."),
      });
    });

    arrange = [
      { value: "test", property: "field" },
      { value: 5, property: "field" },
      { value: 0, property: "field" },
      { value: false, property: "field" },
    ];

    arrange.forEach((item: any) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "required",
        error: new ValidationError("The field is required."),
      });
    });
  });

  test("string validation rule", () => {
    const error = new ValidationError("The field must be a string.");

    let arrange: Values[] = [
      { value: 5, property: "field" },
      { value: {}, property: "field" },
      { value: false, property: "field" },
    ];

    arrange.forEach((item: any) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "string",
        error,
      });
    });

    arrange = [
      { value: "test", property: "field" },
      { value: null, property: "field" },
      { value: undefined, property: "field" },
    ];

    arrange.forEach((item: any) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "string",
        error,
      });
    });
  });

  test("maxLength validation rule", () => {
    const error = new ValidationError(
      "The field must be less or equal than 2 characters."
    );

    let arrange: Values[] = [{ value: "123", property: "field" }];

    arrange.forEach((item: any) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "maxLength",
        error,
        params: [2],
      });
    });

    arrange = [
      { value: 5, property: "field" },
      { value: null, property: "field" },
      { value: undefined, property: "field" },
    ];

    arrange.forEach((item: any) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "maxLength",
        error,
        params: [2],
      });
    });
  });

  test("boolean validation rule", () => {
    const error = new ValidationError("The field must be a boolean.");

    let arrange: Values[] = [
      { value: 5, property: "field" },
      { value: "true", property: "field" },
      { value: "false", property: "field" },
    ];

    arrange.forEach((item: any) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: "boolean",
        error,
      });
    });

    arrange = [
      { value: true, property: "field" },
      { value: false, property: "field" },
      { value: null, property: "field" },
      { value: undefined, property: "field" },
    ];

    arrange.forEach((item: any) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "boolean",
        error,
      });
    });
  });

  it("should throw a validation error when combine two or more validation rules", () => {
    let validator = ValidatorRules.values(null, "field");
    expect(() => validator.required().string().maxLength(5)).toThrow(
      "The field is required."
    );

    validator = ValidatorRules.values(5, "field");
    expect(() => validator.required().string().maxLength(5)).toThrow(
      "The field must be a string."
    );

    validator = ValidatorRules.values("123456", "field");
    expect(() => validator.required().string().maxLength(5)).toThrow(
      "The field must be less or equal than 5 characters."
    );

    validator = ValidatorRules.values("1", "field");
    expect(() => validator.required().boolean()).toThrow(
      "The field must be a boolean."
    );
  });

  it("should not throw a validation error with complete and correct validation", () => {
    let validator = ValidatorRules.values("123", "field");
    expect(() => validator.required().string().maxLength(5)).toBeTruthy();

    validator = ValidatorRules.values(true, "field");
    expect(() => validator.required().boolean()).toBeTruthy();
  });
});
