import {
  BadRequestException,
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
import { User } from 'src/user/model/user.model';
import { MailService } from 'src/mail/mail.service';
import { Market } from 'src/market/model/market.model';
import { catchError } from 'src/utils/chatchError';
import { Tranzaksiya } from 'src/tranzaktion/model/tranzaktion.model';
import { Request } from 'express';
import { Transaction } from 'sequelize';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Orders) private readonly OrderModel: typeof Orders,
    @InjectModel(Order_Item)
    private readonly Order_ItemModel: typeof Order_Item,
    @InjectModel(Product) private readonly ProductModel: typeof Product,
    @InjectModel(Savat) private readonly SavatModel: typeof Savat,
    @InjectModel(User) private readonly UserModel: typeof User,
    @InjectModel(Market) private readonly MarkedModel: typeof Market,
    private readonly sequolizs: Sequelize,
    private readonly mail: MailService
  ) {}

  async create(data: CreateOrderDto, req: Request) {
    const T = await this.sequolizs.transaction();
    const userId = req['user'].id;
    try {
      const SavatItem = await this.SavatModel.findAll({
        where: { userId: userId },
        transaction: T,
      });

      if (SavatItem.length == 0) {
        throw new NotFoundException("Sizning savatingiz bo'sh");
      }

      const Jami: { [key: number]: number } = {};

      for (const i of SavatItem) {
        const productId = i.dataValues.productId;
        const count = i.dataValues.count;
        if (!Jami[productId]) {
          Jami[productId] = 0;
        }
        Jami[productId] += count;
      }

      for (const productIdStr in Jami) {
        const productId = parseInt(productIdStr, 10);
        const TotalCount = Jami[productId];
        const product = await this.ProductModel.findByPk(productId);
        if (!product) {
          throw new NotFoundException(`Mahsulot topilmadi: ${productId}`);
        }

        if (TotalCount > product.dataValues.count) {
          await this.SavatModel.destroy({
            where: { userId: userId },
            transaction: T
          });
          throw new BadRequestException(
            `Mahsulot yetarli emas: ${product.dataValues.name} — bor: ${product.dataValues.count}`
          );
        }
      }
      const order = await this.OrderModel.create(
        {
          userId: userId,
          addres: data.addres,
          status: Status.PENDING,
        },
        { transaction: T }
      );
      for (const N of SavatItem) {
        const productId = N.dataValues.productId;
        const product = await this.ProductModel.findByPk(productId);

        const savatCount = N.dataValues.count;
        const productCount = product!.dataValues.count;
        await this.Order_ItemModel.create(
          {
            orderId: order.dataValues.id,
            productId,
            count: savatCount,
            price_at_order: product!.dataValues.price,
          },
          { transaction: T }
        );

        await product!.update(
          { count: productCount - savatCount },
          { transaction: T }
        );
      }

      await this.SavatModel.destroy({
        where: { userId: userId },
        transaction: T,
      });

      await T.commit();

      const user = await this.UserModel.findByPk(userId);

      this.mail.sendMail(
        user?.dataValues.email,
        `Hurmatliy ${user?.dataValues.name}`,
        `<h2> Sizning buyurtmangiz muvaffaqiyatli qabul qilindi </h2>`
      );
      return { message: 'Order created', orderId: order.dataValues.id };
    } catch (error) {
      try {
        await T.rollback();
      } catch (rollbackError) {
        return { rollbackError };
      }

      return catchError(error);
    }
  }

  async findAll(req: Request) {
    try {
      const data = await this.OrderModel.findAll({
        where: { userId: req['user'].id },
        include: [
          { model: User },
          { model: Order_Item },
          { model: Tranzaksiya },
        ],
      });
      if (data) return { statusCode: 200, data: data };
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number, req: Request) {
    try {
      const data = await this.OrderModel.findOne({
        where: { userId: req['user'].id },
        include: [
          { model: User },
          { model: Order_Item },
          { model: Tranzaksiya },
        ],
      });

      if (!data) {
        throw new NotFoundException('Not fount by id');
      }
      return { statusCode: 200, data: data };
    } catch (error) {
      return catchError(error);
    }
  }
  async Update_Status(id: number, status: StatusDto) {
    try {
      const data = await this.OrderModel.findByPk(id);
      if (!data) {
        throw new NotFoundException('Not fount order by id');
      }

      data.dataValues.status = status;
      await this.OrderModel.update(data.dataValues, {
        where: { id: data.dataValues.id },
        returning: true,
      });
      return {
        message: 'status Update',
      };
    } catch (error) {
      return catchError(error);
    }
  }
}
