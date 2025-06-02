import {
  Column,
  DataType,
  Table,
  Model,
  BelongsTo,
  HasMany,
  ForeignKey,
} from 'sequelize-typescript';
import { Category } from 'src/category/model/category.model';
import { Chat } from 'src/chat/model/chat.entity';
import { Comment } from 'src/comment/model/comment.model';
import { Market } from 'src/market/model/market.model';
import { Order_Item } from 'src/order_items/model/order_item.model';
import { Rating } from 'src/rating/model/rating.model';
import { Savat } from 'src/savat/model/savat.model';
import { User } from 'src/user/model/user.model';

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
  image: string;

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

  @ForeignKey(() => Market)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  market_id: number;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  category_id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  seller_id: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price: number;

  @BelongsTo(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  seller: User;

  @BelongsTo(() => Market, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  market: Market;

  @BelongsTo(() => Category, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  category: Category;

  @HasMany(() => Order_Item)
  orderItems: Order_Item[];

  @HasMany(() => Savat)
  savatItems: Savat[];

  @HasMany(() => Comment)
  comment: Comment[];

  @HasMany(() => Chat)
  chat: Chat[];

  @HasMany(() => Rating)
  reyting: Rating[];
}
