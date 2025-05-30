import {
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
  Model
} from 'sequelize-typescript';
import { User } from 'src/user/model/user.model';

@Table({ tableName: 'rating' })
export class Rating extends Model {
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

  @BelongsTo(() => User)
  seller: User;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ball: number;
}
