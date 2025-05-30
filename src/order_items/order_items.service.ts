import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order_Item } from './model/order_item.model';
import { Orders } from 'src/order/model/order.entity';
import { Product } from 'src/product/model/product.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectModel(Order_Item) private readonly Model: typeof Order_Item,
  ) {}

  async findAll() {
    try {
      const data = await this.Model.findAll({
        include: [
          { model: Orders, required: true },
        ],
      });
      if (!data.length) {
        throw new NotFoundException();
      }
      return { status: 200, data };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }
}
