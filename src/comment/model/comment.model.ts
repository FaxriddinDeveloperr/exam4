import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from 'src/product/model/product.entity';
import { User } from 'src/user/model/user.model';

@Table({ tableName: 'Comment' })
export class Comment extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  productId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  message: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  star: number;

  @BelongsTo(() => User,{
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  users: number;

  @BelongsTo(() => Product,{
    onDelete: "CASCADE",
    onUpdate:"CASCADE",
  })
  product: Product;
}
