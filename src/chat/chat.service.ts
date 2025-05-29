import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Chat } from './model/chat.entity';
import { identity } from 'rxjs';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat) private model: typeof Chat){}

 async createChat(createChatDto: CreateChatDto) {
    try {
      const chat = await this.model.create({...createChatDto});

        return {
        statusCode: 201,
        message: 'Market successfully created',
        data: chat,
      };


      
    } catch (error) {
      throw new InternalServerErrorException(error.message)
      
    }
  }

  async findAllChat() {
    try {
          const data = await this.model.findAll();
    
          if (!data.length) {
            throw new NotFoundException('No chats found');
          }
    
          return {
            statusCode: 200,
            message: 'All chats found',
            data: data,
          };
        } catch (error) {
          throw new InternalServerErrorException(error.message);
        }
      }


        async findByIdChat(id: number) {
    try {
      const chat = await this.model.findByPk(id);

      if (!chat) {
        throw new NotFoundException(`chat with ID ${id} not found`);
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
      const chat = await this.model.findByPk(id);
      if (!chat) {
        throw new NotFoundException(`chat with ID ${id} not found`);
      }

      const [affectedRows] = await this.model.update(
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
      const chat = await this.model.findByPk(id);
      if (!chat) {
        throw new NotFoundException(`chat with ID ${id} not found`);
      }

      await this.model.destroy({ where: { id } });

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



  



