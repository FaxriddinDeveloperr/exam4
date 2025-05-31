import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './model/comment.model';

@Injectable()
export class CommentService {
  constructor(@InjectModel(Comment) private Model: typeof Comment) {}
   async createComment(createCommentDto: CreateCommentDto) {
    try {
      const comment = await this.Model.create({...createCommentDto})
         return {
          statusCode: 201,
          message: 'success',
          data: comment
         };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllComment() {
    try {
      const data = await this.Model.findAll();
       
      if (!data.length) {
        throw new NotFoundException('comment not found');
      }

      return{
        statusCode: 200,
        message: 'success',
        data: data
      }
    } catch (error) {
          throw new InternalServerErrorException(error.message);
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
            throw new InternalServerErrorException(error.message);
    }
  }

  async updateComment(id: number, updateCommentDto: UpdateCommentDto) {
       try {
      const comment = await this.Model.findByPk(id);
      if (!comment) {
        throw new NotFoundException(`comment with ID ${id} not found`);
      }
const [affectedCount] = await this.Model.update(updateCommentDto, {
  where: { id },
});
if (affectedCount === 0) {
  throw new NotFoundException(`comment with ID ${id} not found`);
}
const updatedComment = await this.Model.findByPk(id);
return {
  statusCode: 200,
  message: 'comment updated successfully',
  data: updatedComment,
};

    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }


    async deleteChat(id: number) {
    try {
      const comment = await this.Model.findByPk(id);
      if (!comment) {
        throw new NotFoundException(`chat with ID ${id} not found`);
      }
      
      await this.Model.destroy({where: { id }});

      return {
        statusCode: 200,
        message: 'comment deleted successfully',
        data: {},
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
