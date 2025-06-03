import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Request } from 'express';
import { Op } from 'sequelize';
import { Category } from 'src/category/model/category.model';
import { Chat } from 'src/chat/model/chat.entity';
import { Comment } from 'src/comment/model/comment.model';
import { Market } from 'src/market/model/market.model';
import { Orders } from 'src/order/model/order.entity';
import { Order_Item } from 'src/order_items/model/order_item.model';
import { Product } from 'src/product/model/product.entity';
import { Rating } from 'src/rating/model/rating.model';
import { Savat } from 'src/savat/model/savat.model';
import { Tranzaksiya } from 'src/tranzaktion/model/tranzaktion.model';
import { Role } from 'src/user/dto/register-user.dto';
import { User } from 'src/user/model/user.model';
import { catchError } from 'src/utils/chatchError';

@Injectable()
export class InfoService {
  constructor(
    @InjectModel(User) private readonly UserModel: typeof User,
    @InjectModel(Market) private readonly MarketModel: typeof Market
  ) {}
  async my_data_buydet(req: Request) {
    try {
      const user = req['user'];
      if (user.role != Role.BUYDET) {
        throw new ForbiddenException();
      }
      const data = await this.UserModel.findByPk(user.id, {
        include: [
          { model: Savat },
          { model: Orders },
          { model: Comment },
          { model: Tranzaksiya },
        ],
      });

      return { data: data };
    } catch (error) {
      return catchError(error);
    }
  }
  async my_data_seller(req: Request) {
    try {
      const user = req['user'];
      if (user.role != Role.SELLER) {
        throw new ForbiddenException();
      }
      const data = await this.UserModel.findByPk(user.id, {
        include: [{ model: Market, include: [Product] }, { model: Rating }],
      });
      return { data: data };
    } catch (error) {
      return catchError(error);
    }
  }
  async my_data_admin(req: Request) {
    try {
      const user = req['user'];
      if (!(user.role == Role.ADMIN || user.role == Role.SUPER_ADMIN)) {
        throw new ForbiddenException();
      }
      const data = await this.UserModel.findByPk(user.id);
      return { data: data };
    } catch (error) {
      return catchError(error);
    }
  }

  async my_marked_seller(req: Request) {
    try {
      const user = req['user'];
      if (user.role != Role.SELLER) {
        throw new ForbiddenException();
      }
      const Marked = await this.MarketModel.findAll({
        where: { seller_Id: user.id },
        include: [{ model: Product, include: [Category, Chat, Rating] }],
      });
      if (!Marked.length) {
        throw new NotFoundException('Sizda hozircha Market yoq');
      }
      return { data: Marked };
    } catch (error) {
      return catchError(error);
    }
  }
   async findAll(query: Record<string, any>) {
      try {
        let { limit, page, order, sortBy, region, phone, full_name } = query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;
        const sortColum = sortBy || 'full_name';
        const sortorder = order == 'asc' ? 'ASC' : 'DESC';
  
        const where: any = {};
        if (region) {
          where.region = { [Op.iLike]: `%${region}%` };
        }
        if (phone) {
          where.phone = { [Op.iLike]: `%${phone}%` };
        }
        if (full_name) {
          where.full_name = { [Op.iLike]: `%${full_name}%` };
        }
        const { count: total, rows: data } = await this.UserModel.findAndCountAll({
          where,
          order: [[sortColum, sortorder]],
          limit,
          offset,
        });
        return { statusCode: 200, total, page, limit, data };
      } catch (error) {
        return catchError(error);
      }
    }
  
}
