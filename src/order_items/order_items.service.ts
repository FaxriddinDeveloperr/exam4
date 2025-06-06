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
import { Request } from 'express';
import { catchError } from 'src/utils/chatchError';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectModel(Order_Item) private readonly Model: typeof Order_Item
  ) {}

  async findAll(query: Record<string, any>, req: Request) {
    try {
      let { page, limit } = query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      const offset = (page - 1) * limit;

      const { count: total, rows: data } = await this.Model.findAndCountAll({
        limit,
        offset,
        include: [{ model: Product }, { model: Orders }],
      });
      return {
        statuscode: 200,
        total,
        page,
        limit,
        data,
      };
    } catch (error) {
      return catchError(error);
    }
  }
}
