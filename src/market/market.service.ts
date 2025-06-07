import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { Market } from './model/market.model';
import { InjectModel } from '@nestjs/sequelize';
import { catchError } from 'src/utils/chatchError';
import { User } from 'src/user/model/user.model';
import { Product } from 'src/product/model/product.entity';
import { Request } from 'express';
import { Role } from 'src/user/dto/register-user.dto';
import { Op } from 'sequelize';

@Injectable()
export class MarketService {
  constructor(@InjectModel(Market) private model: typeof Market) {}

  async createMarket(createMarketDto: CreateMarketDto, req: Request) {
    try {
      let name = await this.model.findOne({
        where: { name: createMarketDto.name },
      });
      if (name) {
        throw new ConflictException('Marked name Olredy exists');
      }
      let data = {
        ...createMarketDto,
        seller_id: req['user'].id,
      };
      const market = await this.model.create({ ...data });

      return {
        statusCode: 201,
        message: 'Market successfully created',
        data: market,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async findAllMarket(req: Request, query: Record<string, any>) {
    try {
      let { limit, page, sortBy, order, name, description } = query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      let offset = (page - 1) * limit;
      let sortColum = sortBy || 'name';
      let sortOrder = order == 'asc' ? 'ASC' : 'DESC';
      let where: any = {};
      if (name) {
        where.name = { [Op.iLike]: `%${name}%` };
      }
      if (description) {
        where.description = { [Op.iLike]: `%${description}%` };
      }
      let user = req['user'];
      if (user.role == Role.SELLER) {
        where.seller_id = user.id;
        const { count: total, rows: data } = await this.model.findAndCountAll({
          where,
          order: [[sortColum, sortOrder]],
          limit,
          offset,
          include: [{ model: User }, { model: Product }],
        });
        if (!data.length) {
          throw new NotFoundException('Not found market ');
        }
        return {
          statusCode: 200,
          total,
          page,
          limit,
          data: data,
        };
      } else {
        const { count: total, rows: data } = await this.model.findAndCountAll({
          where,
          order:[[sortColum, sortOrder]],
          limit,
          offset,
          include: [{ model: Product }],
        });

        if (!data.length) {
          throw new NotFoundException('Not found market ');
        }
        return {
          statusCode: 200,
          total,
          page,
          limit,
          data: data,
        };
      }
    } catch (error) {
      return catchError(error);
    }
  }

  async findByIdMarket(id: number) {
    try {
      const data = await this.model.findByPk(id);
      if (!data) {
        throw new NotFoundException('Not Fount Market by id');
      }
      return {
        statusCode: 200,
        data: data,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async updateMarket(
    id: number,
    updateMarketDto: UpdateMarketDto,
    req: Request
  ) {
    try {
      let user = req['user'];
      const market = await this.model.findByPk(id);
      if (!market) {
        throw new NotFoundException(`Market with ID ${id} not found`);
      }
      if (market.dataValues.seller_id != user.id) {
        throw new ForbiddenException(
          "Siz Faqat O'zingizga tegishliy Market malumotlarini o'zgartirishingiz mumkin"
        );
      }
      const [data] = await this.model.update(updateMarketDto, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: 200,
        message: 'Market updated successfully',
        data: data[0],
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async deleteMarket(id: number, req: Request) {
    try {
      let user = req['user'];
      const market = await this.model.findByPk(id);
      if (!market) {
        throw new NotFoundException(`Market with ID ${id} not found`);
      }
      if (
        !(
          market.dataValues.seller_id == user.id ||
          user.role == Role.SUPER_ADMIN
        )
      ) {
        throw new ForbiddenException(
          "Siz faqat o'zingizga tegishliy Marketni o'shira olasiz"
        );
      }
      await this.model.destroy({ where: { id } });
      return {
        statusCode: 200,
        message: 'Market deleted successfully',
        data: {},
      };
    } catch (error) {
      return catchError(error);
    }
  }
}
