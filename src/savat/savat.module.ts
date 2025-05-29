import { Module } from '@nestjs/common';
import { SavatService } from './savat.service';
import { SavatController } from './savat.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Savat } from './model/savat.model';

@Module({
  imports: [SequelizeModule.forFeature([Savat])],
  controllers: [SavatController],
  providers: [SavatService],
})
export class SavatModule {}
