import { SequelizeModelFactory } from "#seedwork/infra/sequelize/sequelize-model-factory";
import {
  Model,
  Column,
  Table,
  PrimaryKey,
  DataType,
} from "sequelize-typescript";

type CategoriesModelProperties = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
};

@Table({ tableName: "categories", timestamps: false })
export class CategoryModel extends Model<CategoriesModelProperties> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  declare description: string | null;

  @Column({ allowNull: false, type: DataType.BOOLEAN })
  declare is_active: boolean;

  @Column({ allowNull: false, type: DataType.DATE })
  declare created_at: Date;

  static factory() {
    const chance: Chance.Chance = require("chance")();
    return new SequelizeModelFactory<CategoryModel, CategoriesModelProperties>(
      CategoryModel,
      () => ({
        id: chance.guid(),
        name: chance.name(),
        description: chance.paragraph(),
        is_active: true,
        created_at: chance.date(),
      })
    );
  }
}
