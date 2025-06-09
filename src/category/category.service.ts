import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './model/category.model';
import { catchError } from 'src/utils/chatchError';
import { Product } from 'src/product/model/product.entity';
import { FileService } from 'src/file/file.service';
import { Op } from 'sequelize';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category) private model: typeof Category,
    private readonly fileServis: FileService
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    let img = createCategoryDto.icon;
    try {
      const data = await this.model.findOne({
        where: { name: createCategoryDto.name },
      });
      if (data) {
        throw new ConflictException(
          `Category by this name: ${Category.name} olredy existes`
        );
      }
      const category = await this.model.create({ ...createCategoryDto });
      return {
        statusCode: 201,
        message: 'success',
        data: category,
      };
    } catch (error) {
      if (await this.fileServis.existFile(img)) {
        await this.fileServis.deleteFile(img);
      }
      return catchError(error);
    }
  }

  async getAllCategories(query: Record<string, any>) {
    try {
      let { limit, page, sortBy, order, name } = query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      let offset = (page - 1) * limit;
      let sortColumn = sortBy || 'name';
      let sortOrder = order == 'asc' ? 'ASC' : 'DESC';
      let where: any = {};
      if (name) {
        where.name = { [Op.iLike]: `%${name}%` };
      }

      const { count: total, rows: data } = await this.model.findAndCountAll({
        where,
        order: [[sortColumn, sortOrder]],
        limit,
        offset,
        include: { model: Product },
      });

      return {
        satusCode: 200,
        total,
        page,
        limit,
        data: data,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async getCategoryById(id: number) {
    try {
      const categoryById = await this.model.findByPk(id, {
        include: { model: Product },
      });
      if (!categoryById) {
        throw new NotFoundException(`Category by this id:${id} not found`);
      }
      return {
        statusCode: 200,
        message: 'success',
        data: categoryById,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async deleteCategoryById(id: number) {
    try {
      const data = await this.model.findByPk(id);
      if (!data) {
        throw new NotFoundException(`Category by this id:${id} not found`);
      }
      const deletedCategory = await this.model.destroy({ where: { id } });
      if (!deletedCategory) {
        throw new NotFoundException();
      }
      if (await this.fileServis.existFile(data.dataValues.icon)) {
        await this.fileServis.deleteFile(data.dataValues.icon);
      }
      return {
        statusCode: 200,
        message: 'success',
        data: {},
      };
    } catch (error) {
      return catchError(error);
    }
  }
}
