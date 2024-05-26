import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  FindCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@core/admin-video-catalog/category/application';
import {
  CategoryInMemoryRepository,
  CategoryModel,
  CategorySequelizeRepository,
} from '@core/admin-video-catalog/category/infra';
import { CategoryRepository } from '@core/admin-video-catalog/dist/category/domain/repository/category.repository';
import { getModelToken } from '@nestjs/sequelize';

export namespace CATEGORY_PROVIDERS {
  export namespace REPOSITORIES {
    export const CATEGORY_IN_MEMORY_REPOSITORY = {
      provide: 'CategoryInMemoryRepository',
      useClass: CategoryInMemoryRepository,
    };

    export const CATEGORY_SEQUELIZE_REPOSITORY = {
      provide: 'CategorySequelizeRepository',
      useFactory: (categoryModel: typeof CategoryModel) => {
        return new CategorySequelizeRepository(categoryModel);
      },
      inject: [getModelToken(CategoryModel)],
    };

    export const CATEGORY_REPOSITORY = {
      provide: 'CategoryRepository',
      useExisting: 'CategorySequelizeRepository',
    };
  }

  export namespace USE_CASES {
    export const CREATE_CATEGORY_USE_CASE = {
      provide: CreateCategoryUseCase,
      useFactory: (categoryRepository: CategoryRepository.IRepository) => {
        return new CreateCategoryUseCase(categoryRepository);
      },
      inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
    };

    export const LIST_CATEGORY_USE_CASE = {
      provide: ListCategoriesUseCase,
      useFactory: (categoryRepository: CategoryRepository.IRepository) => {
        return new ListCategoriesUseCase(categoryRepository);
      },
      inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
    };

    export const UPDATE_CATEGORY_USE_CASE = {
      provide: UpdateCategoryUseCase,
      useFactory: (categoryRepository: CategoryRepository.IRepository) => {
        return new UpdateCategoryUseCase(categoryRepository);
      },
      inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
    };

    export const DELETE_CATEGORY_USE_CASE = {
      provide: DeleteCategoryUseCase,
      useFactory: (categoryRepository: CategoryRepository.IRepository) => {
        return new DeleteCategoryUseCase(categoryRepository);
      },
      inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
    };

    export const FIND_CATEGORY_USE_CASE = {
      provide: FindCategoryUseCase,
      useFactory: (categoryRepository: CategoryRepository.IRepository) => {
        return new FindCategoryUseCase(categoryRepository);
      },
      inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
    };
  }
}
