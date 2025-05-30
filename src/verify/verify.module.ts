import { Module } from '@nestjs/common';
import { VerifyService } from './verify.service';
import { VerifyController } from './verify.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/model/user.model';

@Module({
  imports: [SequelizeModule.forFeature([User]),
],
  controllers: [VerifyController],
  providers: [VerifyService],
})
export class VerifyModule {}
