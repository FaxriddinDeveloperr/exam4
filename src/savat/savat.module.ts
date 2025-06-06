import { Module } from '@nestjs/common';
import { SavatService } from './savat.service';
import { SavatController } from './savat.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Savat } from './model/savat.model';
import { Product } from 'src/product/model/product.entity';

@Module({
  imports: [SequelizeModule.forFeature([Savat,Product])],
  controllers: [SavatController],
  providers: [SavatService],
})
export class SavatModule {}
