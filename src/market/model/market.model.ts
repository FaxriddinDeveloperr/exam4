import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'markets' })
export class Market extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  seller_id: number;

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
}
