import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSupportTicketDto } from './dto/create-support_ticket.dto';
import { UpdateSupportTicketDto } from './dto/update-support_ticket.dto';
import { InjectModel } from '@nestjs/sequelize';
import { SupportTicket } from './model/support_ticket.model';
import { NotFoundError } from 'rxjs';

@Injectable()
export class SupportTicketService {
  constructor(@InjectModel(SupportTicket) private model: typeof SupportTicket) { }
  
  async createSupportTicket(createSupportTicketDto: CreateSupportTicketDto) {
    try {
      const support_ticket = await this.model.create({ ...createSupportTicketDto })
      return {
        StatusCode: 201,
        message: 'succes',
        data: support_ticket
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getAllTickets() {
    try {
      const data = await this.model.findAll()
      if (!data.length) {
        throw new NotFoundException('Tickets not found')
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

  async getTicketById(id: number) {
    try {
      const data = await this.model.findByPk(id)
      if (!data) {
        throw new NotFoundException(`Ticket by this id:${id} not found`)
      }
      return {
        statusCode: 200,
        message: 'succes',
        data: data
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async update(id: number, updateSupportTicketDto: UpdateSupportTicketDto) {
    try {
      const data = await this.model.findByPk(id)
      if (!data) {
        throw new NotFoundException(`Ticket by this id:${id} not found`)
      }
      const updatedTicket = await this.model.update(updateSupportTicketDto, { where: { id }, returning: true })
      return {
        statusCode: 200,
        message: 'success',
        data: updatedTicket
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async remove(id: number) {
    try {
      const data = await this.model.findByPk(id)
      if (!data) {
        throw new NotFoundException(`Ticket by this id:${id} not found`)
      }
      const deletedTicket = await this.model.destroy({ where: { id } })
      return {
        statusCode: 200,
        message:"succes",
        data: deletedTicket
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}