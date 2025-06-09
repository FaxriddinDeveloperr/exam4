import {
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
  Model,
} from 'sequelize-typescript';
import { Product } from 'src/product/model/product.entity';
import { User } from 'src/user/model/user.model';

@Table({ tableName: 'rating' })
export class Rating extends Model {
  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  productId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  sellerId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ball: number;

  @BelongsTo(() => User, {
    foreignKey: 'sellerId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  seller: User;

  @BelongsTo(() => Product, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  product: Product;
}
