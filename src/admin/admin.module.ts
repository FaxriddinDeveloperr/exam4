import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/model/user.model';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Module({
  imports:[SequelizeModule.forFeature([User]),
JwtModule.register({})
],
  controllers: [AdminController],
  providers: [AdminService, UserService],
})
export class AdminModule {}
