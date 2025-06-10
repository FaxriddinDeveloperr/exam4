import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTranzaktionDto } from './dto/create-tranzaktion.dto';
import { catchError } from 'src/utils/chatchError';
import { InjectModel } from '@nestjs/sequelize';
import { Tranzaksiya } from './model/tranzaktion.model';
import { User } from 'src/user/model/user.model';
import { Orders } from 'src/order/model/order.entity';
import { Request } from 'express';

@Injectable()
export class TranzaktionService {
  constructor(
    @InjectModel(Tranzaksiya) private readonly Model: typeof Tranzaksiya
  ) {}

  async create(createTranzaktionDto: CreateTranzaktionDto, req: Request) {
    try {
      const T = await this.Model.create({
        ...createTranzaktionDto,
        userId: req['user'].id,
      });
      return { statusCode: 201, message: 'Creted', data: T };
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll() {
    try {
      const data = await this.Model.findAll({
        include: [{ model: User }, { model: Orders }],
      });

      if (!data.length) {
        throw new NotFoundException('Not fount tranzaksiya');
      }

      return { statusCode: 200, data: data };
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number, req: Request) {
    try {
      const data = await this.Model.findOne({
        where: { userId: req['user'].id },
      });
      if (!data) {
        throw new NotFoundException('Not fount tranzaksiya');
      }
      return { statusCode: 200, data: data };
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: number) {
    try {
      const data = await this.Model.findByPk(id);
      if (!data) {
        throw new NotFoundException('Not fount tranzaksiya');
      }
      return { statusCode: 200, data: data };
    } catch (error) {
      return catchError(error);
    }
  }
}
