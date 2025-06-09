import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Orders } from './model/order.entity';
import { Product } from 'src/product/model/product.entity';
import { Savat } from 'src/savat/model/savat.model';
import { Order_Item } from 'src/order_items/model/order_item.model';
import { User } from 'src/user/model/user.model';
import { Market } from 'src/market/model/market.model';

@Module({
  imports:[SequelizeModule.forFeature([Orders,Product, Savat, Order_Item, User, Market])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
