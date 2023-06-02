import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IUpdateCategoryInput } from '@core/admin-video-catalog/category/application';

export class UpdateCategoryDto implements Omit<IUpdateCategoryInput, 'id'> {
  name: string;
  description?: string;
  is_active?: boolean;
}
