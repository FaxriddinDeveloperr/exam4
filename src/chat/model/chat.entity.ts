import { Column, DataType, Table,Model } from "sequelize-typescript";

@Table({ tableName: 'chat' })
export class Chat extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  message: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  receiver_id: number;

  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  product_id: number;


  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  sender_id: number;
}