import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto, Status, StatusDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Orders } from './model/order.entity';
import { Order_Item } from 'src/order_items/model/order_item.model';
import { Product } from 'src/product/model/product.entity';
import { Savat } from 'src/savat/model/savat.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Orders) private readonly OrderModel: typeof Orders,
    @InjectModel(Order_Item) private readonly Order_ItemModel: typeof Order_Item,
    @InjectModel(Product) private readonly ProductModel: typeof Product,
    @InjectModel(Savat) private readonly SavatModel: typeof Savat,
    private readonly sequolizs: Sequelize,
  ) {}

  async create(data: CreateOrderDto) {
    try {
      const T = await this.sequolizs.transaction();

      const order = await this.OrderModel.create(
        {
          userId: data.userId,
          addres: data.addres,
          status: Status.PENDING,
        },
        { transaction: T },
      );
      const SavatItem = await this.SavatModel.findAll({
        where: { userId: data.userId },
        transaction: T,
      });
      for (const N of SavatItem) {
        const product = await this.ProductModel.findByPk(N.productId);

        await this.Order_ItemModel.create(
          {
            orderId: order.dataValues.id,
            productId: N.productId,
            count: N.count,
            price_at_order: product?.dataValues.price,
          },
          { transaction: T },
        );
      }
      await this.SavatModel.destroy({
        where: { userId: data.userId },
        transaction: T,
      });

      await T.commit();
      return { message: 'Order creted', orderId: order.dataValues.id };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Buyurtma berishda xatolik berdi');
    }
  }

  async findAll() {
    try {
      const data = await this.OrderModel.findAll();
      if (!data.length) {
        throw new NotFoundException('Not fount order');
      }
      return { statusCode: 200, data: data };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.OrderModel.findByPk(id);
      if (!data) {
        throw new NotFoundException('Not fount by id');
      }
      return { statusCode: 200, data: data };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }
  async Update_Status(id: number, status: StatusDto) {
    try {
      const data = await this.OrderModel.findByPk(id);
      if (!data) {
        throw new NotFoundException('Not fount order by id');
      }
      data.dataValues.status = status;
      return {
        message: 'status Update',
        data: await this.OrderModel.update(data.dataValues, {
          where: { id: data.dataValues.id },
          returning: true,
        }),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }
}
