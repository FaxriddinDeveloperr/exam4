import { Model } from 'sequelize';
import {
  AllowNull,
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/model/user.model';

@Table({ tableName: 'rating' })
export class Rating extends Model {






  @ForeignKey(() => User)
  @Column({ field: 'userId' })
  userId: number;

  @HasOne(() => User)
  user: User;

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  ball: Number;
}
