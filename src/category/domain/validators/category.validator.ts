import { ClassValidatorFields } from "../../../@seedwork/validators/class-validator-fields";
import { ICategoryProperties } from "../entities/category.interface";
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsDate,
} from "class-validator";

export class CategoryRules {
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  is_active: string;

  @IsDate()
  @IsOptional()
  created_at: Date;

  constructor({
    name,
    description,
    is_active,
    created_at,
  }: ICategoryProperties) {
    Object.assign(this, { name, description, is_active, created_at });
  }
}

export class CategoryValidator extends ClassValidatorFields<CategoryRules> {
  validate(data: ICategoryProperties): boolean {
    return super.validate(new CategoryRules(data ?? {} as any));
  }
}

export default class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator();
  }
}
