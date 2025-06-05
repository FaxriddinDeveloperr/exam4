import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './model/product.entity';
import { Op } from 'sequelize';
import { catchError } from 'src/utils/chatchError';
import { Market } from 'src/market/model/market.model';
import { Order_Item } from 'src/order_items/model/order_item.model';
import { Comment } from 'src/comment/model/comment.model';
import { Savat } from 'src/savat/model/savat.model';
import { Category } from 'src/category/model/category.model';
import { Rating } from 'src/rating/model/rating.model';
import { Chat } from 'src/chat/model/chat.entity';
import { FileService } from 'src/file/file.service';
import { Request } from 'express';
import { Role } from 'src/user/dto/register-user.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private readonly model: typeof Product,
    private readonly fileservis: FileService
  ) {}

  async createProduct(createProductDto: CreateProductDto) {
    let img = createProductDto.image;
    try {
      
      const product = await this.model.create({ ...createProductDto });

      return {
        statusCode: 201,
        message: 'Product successfully created',
        data: product,
      };
    } catch (error) {
      if (await this.fileservis.existFile(img)) {
        this.fileservis.deleteFile(img);
      }
      return catchError(error);
    }
  }

  async findAllProduct(query: Record<string, any>) {
    let { page, limit, sortBy, order, name, description } = query;
    try {
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      const offset = (page - 1) * limit;
      const sortColum = sortBy || 'name';
      const sortOrder = order == 'asc' ? 'ASC' : 'DESC';

      const where: any = {};
      if (name) {
        where.name = { [Op.iLike]: `%${name}%` };
      }
      if (description) {
        where.description = { [Op.iLike]: `%${description}%` };
      }

      const { count: total, rows: data } = await this.model.findAndCountAll({
        where,
        order: [[sortColum, sortOrder]],
        limit,
        offset,
        include: [
          { model: Market },
          { model: Order_Item },
          { model: Comment },
          { model: Savat },
          { model: Category },
          { model: Rating },
          { model: Chat },
        ],
      });
      return {
        total,
        page,
        limit,
        data,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async findByIdProduct(id: number) {
    try {
      const product = await this.model.findByPk(id, {
        include: [
          { model: Market },
          { model: Order_Item },
          { model: Comment },
          { model: Savat },
          { model: Category },
          { model: Rating },
          { model: Chat },
        ],
      });
      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }
      return {
        statusCode: 200,
        message: 'Product found',
        data: product,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
    req: Request
  ) {
    let img = updateProductDto.image;
    let seller = req['user'];
    try {
      const product = await this.model.findOne({
        where: { id: id },
        include: { model: Market, as: "market", attributes: ['seller_id'] },
      });
      if (!product) {
        throw new NotFoundException(
          `Product with id ${id} not found for update`
        );
      }
      
      if (product.market.seller_id != seller.id) {
        throw new ForbiddenException();
      }

      const [_, updatedProduct] = await this.model.update(updateProductDto, {
        where: { id },
        returning: true,
      });

      if (await this.fileservis.existFile(product.dataValues.image)) {
        await this.fileservis.deleteFile(product.dataValues.image);
      }
      return {
        statusCode: 200,
        message: 'Product updated successfully',
        data: updatedProduct[0],
      };
    } catch (error) {
      if (await this.fileservis.existFile(img)) {
        await this.fileservis.deleteFile(img);
      }
      return catchError(error);
    }
  }

  async deletProduct(id: number, req: Request) {
    try {
      let user = req['user'];
      const product = await this.model.findOne({
        where: { id: id },
        include: { model: Market, attributes: ['seller_id'] },
      });
      if (!product) {
        throw new NotFoundException(
          `Product with id ${id} not found for update`
        );
      }
      if (
        product['Market'].seller_id != user.id ||
        user.role != Role.SUPER_ADMIN ||
        user.role != Role.ADMIN
      ) {
        throw new ForbiddenException();
      }

      const deletedCount = await this.model.destroy({ where: { id } });
      if (!deletedCount) {
        throw new NotFoundException();
      }
      if (await this.fileservis.existFile(product.dataValues.image)) {
        await this.fileservis.deleteFile(product.dataValues.image);
      }
      return {
        statusCode: 200,
        message: 'Product deleted successfully',
        data: { id },
      };
    } catch (error) {
      return catchError(error);
    }
  }
}
