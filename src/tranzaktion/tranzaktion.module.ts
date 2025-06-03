import { Module } from '@nestjs/common';
import { TranzaktionService } from './tranzaktion.service';
import { TranzaktionController } from './tranzaktion.controller';
import sequelize from 'sequelize';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tranzaksiya } from './model/tranzaktion.model';



@Module({
  imports:[SequelizeModule.forFeature([Tranzaksiya])],
  controllers: [TranzaktionController],
  providers: [TranzaktionService],
})
export class TranzaktionModule {}
