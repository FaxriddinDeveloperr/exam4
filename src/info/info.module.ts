import { Module } from '@nestjs/common';
import { InfoService } from './info.service';
import { InfoController } from './info.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/model/user.model';
import { Product } from 'src/product/model/product.entity';
import { Market } from 'src/market/model/market.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Market])],
  controllers: [InfoController],
  providers: [InfoService],
})
export class InfoModule {}
