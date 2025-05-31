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

  async create(data: CreateOrderDto) {
    const T = await this.sequolizs.transaction();
    try {
      const SavatItem = await this.SavatModel.findAll({
        where: { userId: data.userId },
        transaction: T,
      });

      if (!SavatItem || SavatItem.length === 0) {
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
          throw new BadRequestException(
            `Mahsulot yetarli emas: ${product.dataValues.name} — bor: ${product.dataValues.count}`
          );
        }
      }
      const order = await this.OrderModel.create(
        {
          userId: data.userId,
          addres: data.addres,
          status: Status.PENDING,
        },
        { transaction: T }
      );
      let marked_id = 0;
      for (const N of SavatItem) {
        const productId = N.dataValues.productId;
        const product = await this.ProductModel.findByPk(productId);

        const savatCount = N.dataValues.count;
        const productCount = product!.dataValues.count;

        marked_id = product?.dataValues.market_id;
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
        where: { userId: data.userId },
        transaction: T,
      });

      await T.commit();

      const user = await this.UserModel.findByPk(data.userId);
      console.log(user?.dataValues);

      this.mail.sendMail(
        user?.dataValues.email,
        `Hurmatliy ${user?.dataValues.name}`,
        `<h2> Sizning buyurtmangiz muvaffaqiyatli qabul qilindi </h2>`
      );

      const SellerEmail = await this.MarkedModel.findByPk(marked_id, {
        include: [
          {
            model: this.UserModel,
            as: 'seller_Id',
            attributes: ['email', 'name'],
          },
        ],
      });
      if (SellerEmail) {
        this.mail.sendMail(
          SellerEmail.dataValues.email,
          `Hurmatli ${SellerEmail.dataValues.name},`,
          `<h2> Sizning do'koningiz uchun yangi buyurtma qabul qilindi.</h2>`
        );
      }

      return { message: 'Order created', orderId: order.dataValues.id };
    } catch (error) {
      await T.rollback();
      if (error instanceof HttpException) throw error;
      console.error('Error:', error);
      throw new InternalServerErrorException(
        'Buyurtma berishda xatolik yuz berdi'
      );
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
      await this.OrderModel.update(data.dataValues, {
        where: { id: data.dataValues.id },
        returning: true,
      });
      return {
        message: 'status Update',
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }
}
