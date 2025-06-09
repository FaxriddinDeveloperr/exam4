import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './model/comment.model';
import { catchError } from 'src/utils/chatchError';
import { Request } from 'express';

@Injectable()
export class CommentService {
  constructor(@InjectModel(Comment) private Model: typeof Comment) {}
  async createComment(createCommentDto: CreateCommentDto, req: Request) {
    try {
      const comment = await this.Model.create({
        ...createCommentDto,
        userId: req['user'].id,
      });
      return {
        statusCode: 201,
        message: 'success',
        data: comment,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async findAllComment() {
    try {
      const data = await this.Model.findAll();

      if (!data.length) {
        throw new NotFoundException('comment not found');
      }

      return {
        statusCode: 200,
        message: 'success',
        data: data,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async findByIdComment(id: number) {
    try {
      const comment = await this.Model.findByPk(id);

      if (!comment) {
        throw new NotFoundException(`Chat with ID ${id} not found`);
      }

      return {
        statusCode: 206,
        message: 'comment found',
        data: comment,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async deleteChat(id: number) {
    try {
      const comment = await this.Model.findByPk(id);
      if (!comment) {
        throw new NotFoundException(`chat with ID ${id} not found`);
      }

      await this.Model.destroy({ where: { id } });

      return {
        statusCode: 200,
        message: 'comment deleted successfully',
        data: {},
      };
    } catch (error) {
      return catchError(error);
    }
  }
}
