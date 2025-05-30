import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSavatDto } from './dto/create-savat.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Savat } from './model/savat.model';
@Injectable()
export class SavatService {
  constructor(@InjectModel(Savat) private readonly Model: typeof Savat){}

  async create(createSavatDto: CreateSavatDto) {
    try {
      const data = await this.Model.create({...createSavatDto})
      return {Message: "creted", statusCode: 201, data}
    } catch (error) {
       if(error instanceof HttpException) throw error
      throw new InternalServerErrorException(error.message)
    }
  }

  async findAll() {
    try {
      const data  = await this.Model.findAll()
      if(!data.length){
        throw new NotFoundException
      }
      return {statusCode: 200, data: data}
    } catch (error) {
      if(error instanceof HttpException) throw error
      throw new InternalServerErrorException(error.message)
    }
  }

  async remove(id: number) {
    try {
      const data = await this.Model.findByPk(id)
      if(!data){
        throw new NotFoundException("Not fount by id")
      }
      return {message: "Deleted", data: await this.Model.destroy({where: {id}}) }

    } catch (error) {
      if(error instanceof HttpException) throw error
      throw new InternalServerErrorException(error.message)
    }
  }
}
