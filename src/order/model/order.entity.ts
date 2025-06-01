import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Order_Item } from 'src/order_items/model/order_item.model';
import { User } from 'src/user/model/user.model';

@Table({ modelName: 'Orders' })
export class Orders extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.ENUM('pending', 'activ', 'finish'),
    defaultValue: 'pending',
  })
  status: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  addres: string;

  @BelongsTo(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: User;

  @HasMany(() => Order_Item)
  items: Order_Item[];

  //   @HasOne(() => Transaction)
  //   transaction: Transaction;
}
