import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Chat } from './model/chat.entity';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat) private chatModel: typeof Chat) {}

  async createChat(createChatDto: CreateChatDto)  {
    try {
      const chat = await this.chatModel.create({...createChatDto})
            return {
        statusCode: 201,
        message: 'Chat successfully created',
        data: chat,
      };
      
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error.message);
    }
    
  }

  async findAllChat() {
  try {
    const data = await this.chatModel.findAll();

    if (!data.length) {
      throw new NotFoundException('No chats found');
    }

    return{
      statusCode: 200,
        message: 'All chats found',
        data: data
    }
  } catch (error) {
    throw new InternalServerErrorException(error.message);
  }  
  }



  async findByIdChat(id: number) {
    try {
      const chat = await this.chatModel.findByPk(id);
       
      if (!chat) {
        throw new NotFoundException(`Chat with ID ${id} not found`);
      }

      return {
        statusCode: 200,
        message: 'chat found',
        data: chat,
      };
        } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateChat(id: number, updateChatDto: UpdateChatDto) {
    try {
      const chat = await this.chatModel.findByPk(id);
      if (!chat) {
        throw new NotFoundException(`chat with ID ${id} not found`);
      }

      const [, affectedRows] = await this.chatModel.update(
        updateChatDto,
        {
          where: { id },
          returning: true,
        },
      );

      return {
        statusCode: 200,
        message: 'chat updated successfully',
        data: affectedRows[0],
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

 
  async deleteChat(id: number) {
    try {
      const chat = await this.chatModel.findByPk(id);
      if (!chat) {
        throw new NotFoundException(`chat with ID ${id} not found`);
      }
      
      await this.chatModel.destroy({where: { id }});

      return {
        statusCode: 200,
        message: 'chat deleted successfully',
        data: {},
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  }