import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Chat } from './model/chat.entity';
import { User } from 'src/user/model/user.model';
import { Product } from 'src/product/model/product.entity';

@Module({
  imports: [SequelizeModule.forFeature([Chat, User,Product])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
