import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './model/product.entity';
import { Market } from 'src/market/model/market.model';
import { Category } from 'src/category/model/category.model';

@Module({
  imports:[SequelizeModule.forFeature([Product, Market, Category])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
