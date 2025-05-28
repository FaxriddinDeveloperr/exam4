import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating } from './model/rating.model';
import { InjectModel } from '@nestjs/sequelize';
import { retry } from 'rxjs';

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
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllRatings() {
    try {
      const data = await this.model.findAll();
      if(!data.length){
        throw new NotFoundException('Ratings not found')
      }
      return {
        statusCode: 200,
        message: 'success',
        data: data
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getRatingById(id: number) {
    try {
      const ratingById = await this.model.findByPk(id)
      if(!ratingById){
        throw new NotFoundException('Rating by this ID not found')
      }
      return {
        statusCode: 200,
        message: 'success',
        data: ratingById
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async updateRatignById(id: number, updateRatingDto: UpdateRatingDto) {
    try {
      const data = await this.model.findByPk(id)
      if(!data){
        throw new NotFoundException('Rating by this ID not found')
      }
      const updatedRating = await this.model.update(updateRatingDto, {
        where: { id },
        returning: true,
      })
      return {
        statusCode: 200,
        message: 'success',
        data: updatedRating
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  // remove(id: number) {
  //   return `This action removes a #${id} rating`;
  // }
}
