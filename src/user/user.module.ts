import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './model/user.model';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [SequelizeModule.forFeature([User]),
  MailModule
],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
