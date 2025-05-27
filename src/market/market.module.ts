import { Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Market } from './model/market.model';

@Module({
  imports: [SequelizeModule.forFeature([Market])],
  controllers: [MarketController],
  providers: [MarketService],
  exports: [MarketService],
})
export class MarketModule {}
