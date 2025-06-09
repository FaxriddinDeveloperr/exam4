import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  HasMany,
} from 'sequelize-typescript';
import { Product } from 'src/product/model/product.entity';

@Table({ tableName: 'category' })
export class Category extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  icon: string;

  @HasMany(() => Product)
  product: Product[];
}
