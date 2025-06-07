import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from 'src/product/model/product.entity';
import { User } from 'src/user/model/user.model';

@Table({ tableName: 'markets' })
export class Market extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  seller_id: number;

  @BelongsTo(() => User, {
    foreignKey: 'seller_id', as: "seller_Id",
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  seller: User;

  @Column({
    type: DataType.FLOAT,
    defaultValue: 0,
  })
  total_reyting: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  contact: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  follower_count: number;

  @HasMany(() => Product, { foreignKey: 'market_id', as: 'product' })
  product: Product[];
}
