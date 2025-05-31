import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Chat } from 'src/chat/model/chat.entity';
import { Comment } from 'src/comment/model/comment.model';
import { Market } from 'src/market/model/market.model';
import { Notification } from 'src/notification/model/notification.model';
import { Orders } from 'src/order/model/order.entity';
import { Product } from 'src/product/model/product.entity';
import { Rating } from 'src/rating/model/rating.model';
import { Savat } from 'src/savat/model/savat.model';
import { SupportTicket } from 'src/support_ticket/model/support_ticket.model';

@Table({ tableName: 'users' })
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  full_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.ENUM('admin', 'buydet', 'seller', 'super_admin'),
    defaultValue: 'buydet',
  })
  role: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  IsActive: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
  })
  region: string;

  @HasMany(() => Product)
  products: Product[];

  @HasMany(() => Orders)
  orders: Orders[];

  @HasMany(() => Chat, { foreignKey: 'sender_id' })
  sentMessages: Chat[];

  @HasMany(() => Chat, { foreignKey: 'receiver_id' })
  receivedMessages: Chat[];

  @HasMany(() => SupportTicket)
  supportTickets: SupportTicket[];

  @HasMany(() => Notification)
  notifications: Notification[];

  @HasMany(() => Comment)
  comments: Comment[];

  // @HasMany(() => Transaction)
  // transactions: Transaction[];

  @HasMany(() => Savat)
  savatItems: Savat[];

  @HasMany(()=> Market, {foreignKey: "seller_id"})
  market: Market[]

  @HasMany(()=>Rating)
  rating: Rating[]
}
