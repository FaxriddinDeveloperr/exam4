import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Orders } from 'src/order/model/order.entity';
import { Product } from 'src/product/model/product.entity';

@Table({ modelName: 'Order_item' })
export class Order_Item extends Model {
  @ForeignKey(() => Orders)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  orderId: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  productId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  count: number;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  price_at_order: number;

  @BelongsTo(() => Orders, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  order: Orders;

  @BelongsTo(() => Product, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  product: Product;
}
