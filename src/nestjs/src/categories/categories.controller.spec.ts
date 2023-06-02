import { CategoriesController } from './categories.controller';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  ICreateCategoryOutput,
  IDeleteCategoryOutput,
  IFindCategoryOutput,
  IListCategoriesOutput,
  IUpdateCategoryOutput,
} from '@core/admin-video-catalog/category/application';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SearchCategoryDto } from './dto/search-category.dto';

describe('CategoriesController Unit Tests', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController(null, null, null, null, null);
  });

  it('should creates a category', async () => {
    const input: CreateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };

    const output: ICreateCategoryOutput = {
      id: 'ac610bb3-3c0d-4a27-b799-a3f44c67f786',
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };

    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(output),
    };

    //@ts-expect-error
    controller['createUseCase'] = mockCreateUseCase;

    const result = await controller.create(input);

    expect(mockCreateUseCase.execute).toBeCalledWith(input);
    expect(result).toStrictEqual(output);
  });

  it('should updates a category', async () => {
    const id = 'ac610bb3-3c0d-4a27-b799-a3f44c67f786';
    const input: UpdateCategoryDto = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };

    const output: IUpdateCategoryOutput = {
      id,
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };

    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(output),
    };

    //@ts-expect-error
    controller['updateUseCase'] = mockUpdateUseCase;

    const result = await controller.update(id, input);

    expect(mockUpdateUseCase.execute).toBeCalledWith({
      id,
      ...input,
    });
    expect(result).toStrictEqual(output);
  });

  it('should deletes a category', async () => {
    const id = 'ac610bb3-3c0d-4a27-b799-a3f44c67f786';
    const output = undefined;
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error
    controller['deleteUseCase'] = mockDeleteUseCase;
    const result = await controller.remove(id);
    expect(mockDeleteUseCase.execute).toBeCalledWith({ id });
    expect(result).toStrictEqual(output);
  });

  it('should find a category', async () => {
    const id = 'ac610bb3-3c0d-4a27-b799-a3f44c67f786';
    const output: IFindCategoryOutput = {
      id,
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };
    const mockFindUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error
    controller['findUseCase'] = mockFindUseCase;
    const result = await controller.findOne(id);
    expect(mockFindUseCase.execute).toBeCalledWith({
      id,
    });
    expect(result).toStrictEqual(output);
  });

  it('should list categories', async () => {
    const id = 'ac610bb3-3c0d-4a27-b799-a3f44c67f786';
    const input: SearchCategoryDto = {
      filter: null,
      page: 1,
      per_page: 1,
      sort: null,
      sort_dir: null,
    };
    const output: IListCategoriesOutput = {
      items: [
        {
          id,
          name: 'Movie',
          description: 'some description',
          is_active: true,
          created_at: new Date(),
        },
      ],
      current_page: 1,
      last_page: 1,
      per_page: 1,
      total: 1,
    };
    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error
    controller['listUseCase'] = mockListUseCase;
    const result = await controller.search(input);
    expect(mockListUseCase.execute).toBeCalledWith(input);
    expect(result).toStrictEqual(output);
  });
});
