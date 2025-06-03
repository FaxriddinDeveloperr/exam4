import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './model/category.model';
import { catchError } from 'src/utils/chatchError';
import { Product } from 'src/product/model/product.entity';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category) private model: typeof Category) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const data = await this.model.findOne({
        where: { name: createCategoryDto.name },
      });
      if (data) {
        throw new ConflictException(
          `Category by this name: ${Category.name} not found`
        );
      }
      const category = await this.model.create({ ...createCategoryDto });
      return {
        statusCode: 201,
        message: 'success',
        data: category,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async getAllCategories() {
    try {
      const data = await this.model.findAll({ include: { model: Product } });
      if (!data.length) {
        throw new NotFoundException('Categories not found');
      }
      return {
        satusCode: 200,
        message: 'success',
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
