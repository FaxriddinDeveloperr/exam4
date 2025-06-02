import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating } from './model/rating.model';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/model/user.model';
import { catchError } from 'src/utils/chatchError';

@Injectable()
export class RatingService {
  constructor(@InjectModel(Rating) private model: typeof Rating) {}

  async createRaring(createRatingDto: CreateRatingDto) {
    try {
      const rating = await this.model.create({ ...createRatingDto });
      return {
        statusCode: 201,
        message: 'success',
        data: rating,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async getAllRatings() {
    try {
      const data = await this.model.findAll({ include: { model: User } });
      if (!data.length) {
        throw new NotFoundException('Ratings not found');
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

  async getRatingById(id: number) {
    try {
      const ratingById = await this.model.findByPk(+id, {
        include: { model: User },
      });
      if (!ratingById) {
        throw new NotFoundException(`Rating by this id:${id} not found`);
      }
      return {
        statusCode: 200,
        message: 'success',
        data: ratingById,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async updateRatignById(id: number, updateRatingDto: UpdateRatingDto) {
    try {
      const data = await this.model.findByPk(id);
      if (!data) {
        throw new NotFoundException(`Rating by this id:${id} not found`);
      }
      const updatedRating = await this.model.update(updateRatingDto, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: 200,
        message: 'success',
        data: updatedRating,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async deleteRatingById(id: number) {
    try {
      const data = await this.model.findByPk(id);
      if (!data) {
        throw new NotFoundException(`Rating by this id:${id} not found`);
      }
      const deletedData = await this.model.destroy({ where: { id } });
      return {
        statusCode: 200,
        message: 'success',
        data: {},
      };
    } catch (error) {
      return catchError(error);
    }
  }
}
