import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './model/product.entity';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product) private model: typeof Product) {}

  async createProduct(createProductDto: CreateProductDto) {
    try {
      const product = await this.model.create({ ...createProductDto });

      return {
        statusCode: 201,
        message: 'Product successfully created',
        data: product,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllProduct() {
    try {
      const product = await this.model.findAll();
      if (!product.length) {
        throw new NotFoundException('Products not found');
      }
      return {
        statusCode: 200,
        message: 'All products retrieved',
        data: product,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByIdProduct(id: number) {
    try {
      const product = await this.model.findByPk(id);
      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }
      return {
        statusCode: 200,
        message: 'Product found',
        data: product,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.model.findByPk(id);
      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found for update`);
      }

      const [, [updatedProduct]] = await this.model.update(updateProductDto, {
        where: { id },
        returning: true,
      });

      return {
        statusCode: 200,
        message: 'Product updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async deletProduct(id: number) {
    try {
      const deletedCount = await this.model.destroy({ where: { id } });
      if (!deletedCount) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }
      return {
        statusCode: 200,
        message: 'Product deleted successfully',
        data: { id },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }
}
