import {
  Column,
  DataType,
  Table,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Product } from 'src/product/model/product.entity';
import { User } from 'src/user/model/user.model';

@Table({ tableName: 'chat' })
export class Chat extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  message: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  receiver_id: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  product_id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  sender_id: number;

  @BelongsTo(() => Product, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  product: Product;

  @BelongsTo(() => User, {
    foreignKey: 'sendet_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sender: User;

  @BelongsTo(() => User, {
    foreignKey: 'receiver_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  receivr: User;
}
