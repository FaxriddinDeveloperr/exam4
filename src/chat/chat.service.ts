import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Chat } from './model/chat.entity';
import { catchError } from 'src/utils/chatchError';
import { User } from 'src/user/model/user.model';
import { Product } from 'src/product/model/product.entity';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat) private chatModel: typeof Chat) {}

  async createChat(createChatDto: CreateChatDto) {
    try {
      const chat = await this.chatModel.create({ ...createChatDto });
      return {
        statusCode: 201,
        message: 'Chat successfully created',
        data: chat,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async findAllChat() {
    try {
      const data = await this.chatModel.findAll({
        include: [{ model: User }, { model: Product }],
      });

      if (!data.length) {
        throw new NotFoundException('No chats found');
      }

      return {
        statusCode: 200,
        message: 'All chats found',
        data: data,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async findByIdChat(id: number) {
    try {
      const chat = await this.chatModel.findByPk(id, {
        include: [{ model: User }, { model: Product }],
      });

      if (!chat) {
        throw new NotFoundException(`Chat with ID ${id} not found`);
      }

      return {
        statusCode: 200,
        message: 'chat found',
        data: chat,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async deleteChat(id: number) {
    try {
      const chat = await this.chatModel.findByPk(id);
      if (!chat) {
        throw new NotFoundException(`chat with ID ${id} not found`);
      }

      await this.chatModel.destroy({ where: { id } });

      return {
        statusCode: 200,
        message: 'chat deleted successfully',
        data: {},
      };
    } catch (error) {
      return catchError(error);
    }
  }
}
