import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupportTicketDto } from './dto/create-support_ticket.dto';
import { InjectModel } from '@nestjs/sequelize';
import { SupportTicket } from './model/support_ticket.model';
import { catchError } from 'src/utils/chatchError';
import { User } from 'src/user/model/user.model';
import { Request } from 'express';

@Injectable()
export class SupportTicketService {
  constructor(
    @InjectModel(SupportTicket) private model: typeof SupportTicket
  ) {}

  async createSupportTicket(
    createSupportTicketDto: CreateSupportTicketDto,
    req: Request
  ) {
    try {
      const support_ticket = await this.model.create({
        ...createSupportTicketDto,
        userId: req['user'].id,
      });
      return {
        StatusCode: 201,
        message: 'succes',
        data: support_ticket,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async getAllTickets() {
    try {
      const data = await this.model.findAll({ include: { model: User } });
      if (!data.length) {
        throw new NotFoundException('Tickets not found');
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

  async getTicketById(id: number, req: Request) {
    try {
      const data = await this.model.findOne({
        where: { userId: req['user'].id },
        include: { model: User },
      });
      if (!data) {
        throw new NotFoundException('Not fount');
      }
      return {
        statusCode: 200,
        message: 'succes',
        data: data,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: number) {
    try {
      const data = await this.model.findByPk(id);
      if (!data) {
        throw new NotFoundException(`Ticket by this id:${id} not found`);
      }
      const deletedTicket = await this.model.destroy({ where: { id } });
      return {
        statusCode: 200,
        message: 'succes',
        data: deletedTicket,
      };
    } catch (error) {
      return catchError(error);
    }
  }
}
