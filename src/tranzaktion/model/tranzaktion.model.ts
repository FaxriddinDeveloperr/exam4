import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Tolov_turi } from '../dto/create-tranzaktion.dto';
import { Orders } from 'src/order/model/order.entity';
import { User } from 'src/user/model/user.model';

@Table({ tableName: 'tranzaksiya' })
export class Tranzaksiya extends Model {
  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  summa: number;

  @Column({
    type: DataType.ENUM(Tolov_turi.Tolandi, Tolov_turi.kutilmoqda),
    allowNull: false,
  })
  tolov_turi: string;

  @ForeignKey(() => Orders)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  orderId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: User;

  @BelongsTo(() => Orders, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  order: Orders;
}
