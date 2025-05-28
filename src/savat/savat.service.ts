import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
      throw new InternalServerErrorException(error.message)
    }
  }

  findAll() {
    
  }

  remove(id: number) {
    return `This action removes a #${id} savat`;
  }
}
