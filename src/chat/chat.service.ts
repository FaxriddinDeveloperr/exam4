import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Chat } from './model/chat.entity';
import { catchError } from 'src/utils/chatchError';
import { User } from 'src/user/model/user.model';
import { Product } from 'src/product/model/product.entity';
import { Request } from 'express';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat) private readonly chatModel: typeof Chat,
    @InjectModel(User) private readonly UserModel: typeof User,
    @InjectModel(Product) private readonly ProductModel: typeof Product
  ) {}

  async createChat(createChatDto: CreateChatDto, req: Request) {
    try {
      let product = await this.ProductModel.findByPk(createChatDto.product_id);
      let Users = await this.UserModel.findByPk(createChatDto.receiver_id);
      if (!product || !Users) {
        throw new NotFoundException('Product_Id yoki User_Id topilmadi');
      }
      let user = req['user'];

      const chat = await this.chatModel.create({
        ...createChatDto,
        sender_id: user.id,
      });
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
        include: [
          { model: User, as: 'sender' },
          { model: User, as: 'revers' },
          { model: Product },
        ],
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
        include: [
          { model: User, as: 'sender' },
          { model: User, as: 'revers' },
          { model: Product },
        ],
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
