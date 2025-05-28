import { Injectable } from '@nestjs/common';
import { CreateSavatDto } from './dto/create-savat.dto';
import { UpdateSavatDto } from './dto/update-savat.dto';

@Injectable()
export class SavatService {
  create(createSavatDto: CreateSavatDto) {
    return 'This action adds a new savat';
  }

  findAll() {
    return `This action returns all savat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} savat`;
  }

  update(id: number, updateSavatDto: UpdateSavatDto) {
    return `This action updates a #${id} savat`;
  }

  remove(id: number) {
    return `This action removes a #${id} savat`;
  }
}
