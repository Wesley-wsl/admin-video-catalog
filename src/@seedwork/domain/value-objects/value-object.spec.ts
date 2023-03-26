import { deepFreeze } from "../utils/object";
import ValueObject from "./value-object";

class StubValueObject extends ValueObject {}

describe("ValueObject Unit Tests", () => {
  it("should set value", () => {
    const vo = new StubValueObject("string value");
    expect(vo.value).toBe("string value");
  });

  it("should set a object how value", () => {
    const vo = new StubValueObject({ props: "value" });
    expect(vo.value).toStrictEqual({ props: "value" });
  });

  it("Should convert to string", () => {
    const date = new Date();
    let arrange: any[] = [
      { received: "", expected: "" },
      { received: "fake test", expected: "fake test" },
      { received: 0, expected: "0" },
      { received: true, expected: "true" },
      { received: false, expected: "false" },
      { received: date, expected: date.toString() },
      {
        received: { prop: "valueProp" },
        expected: JSON.stringify({ prop: "valueProp" }),
      },
    ];

    arrange.forEach(({ received, expected }) => {
      const vo = new StubValueObject(received);
      expect(vo.toString()).toBe(expected);
    });
  });

  it("should be a immutable object", () => {
    const obj = deepFreeze({
      prop1: "value1",
      deep: { prop2: "value2", prop3: new Date() },
    });

    const vo = new StubValueObject(obj);

    expect(() => ((vo as any).value.prop1 = "test")).toThrow(
      "Cannot assign to read only property 'prop1' of object '#<Object>'"
    );

    expect(() => (vo.value.deep.prop2 = "test")).toThrow(
      "Cannot assign to read only property 'prop2' of object '#<Object>'"
    );

    expect(vo.value.deep.prop3).toBeInstanceOf(Date);
  });
});
