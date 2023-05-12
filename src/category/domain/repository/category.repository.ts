import { ISearchableRepository } from "@seedwork/domain/repository/repository-contract";
import { Category } from "../entities/category";

export interface ICategoryRepository
  extends ISearchableRepository<Category, any, any> {}
