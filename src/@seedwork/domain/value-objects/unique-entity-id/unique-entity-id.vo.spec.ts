import InvalidUuidError from "../../errors/invalid-uuid.error";
import UniqueEntityId from "./unique-entity-id.vo";
import { validate as uuidValidate } from "uuid";

const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, "validate");

describe("UniqueEntityId test", () => {
  it("should throw error when uuid is invalid", async () => {
    expect(() => new UniqueEntityId("fake")).toThrow(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it("should accept a uuid passed in constructor", async () => {
    const uuid = "ac610bb3-3c0d-4a27-b799-a3f44c67f786";
    const uniqueEntityId = new UniqueEntityId(uuid);
    expect(uniqueEntityId.value).toEqual(uuid);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it("should auto generate a uuid valid", async () => {
    const uniqueEntityId = new UniqueEntityId();
    expect(uuidValidate(uniqueEntityId.value)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});
