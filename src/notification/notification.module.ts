import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Notification } from './model/notification.model';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/model/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Notification, User])],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
