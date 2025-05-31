import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './model/category.model';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category) private model: typeof Category) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const data = await this.model.findOne({
        where: { name: createCategoryDto.name },
      });
      if (data) {
        throw new ConflictException(`Category by this name: ${Category.name} not found`);
      }
      const category = await this.model.create({ ...createCategoryDto });
      return {
        statusCode: 201,
        message: 'success',
        data: category,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllCategories() {
    try {
      const data = await this.model.findAll();
      if (!data.length) {
        throw new NotFoundException('Categories not found');
      }
      return {
        satusCode: 200,
        message: 'success',
        data: data,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getCategoryById(id: number) {
    try {
      const categoryById = await this.model.findByPk(id);
      if (!categoryById) {
        throw new NotFoundException(`Category by this id:${id} not found`);
      }
      return {
        statusCode: 200,
        message: 'success',
        data: categoryById,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateCategoryById(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const data = await this.model.findByPk(id);
      if (!data) {
        throw new NotFoundException(`Category by this id:${id} not found`);
      }
      const updatedCategory = await this.model.update(updateCategoryDto, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: 200,
        message: 'success',
        data: updatedCategory,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
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
      throw new InternalServerErrorException(error.message);
    }
  }
}
