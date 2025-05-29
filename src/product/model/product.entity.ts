import { Column, DataType, Table, Model } from 'sequelize-typescript';

@Table({ tableName: 'product' })
export class Product extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  img: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.INTEGER, 
    allowNull: false,
  })
  count: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  market_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  category_id: number;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  price: number;
}
