import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order_Item } from './model/order_item.model';

@Injectable()
export class OrderItemsService {
  constructor(@InjectModel(Order_Item) private readonly Model: typeof Order_Item){}

 async findAll() {
    try {
      const data = await this.Model.findAll()
      if(!data.length){
        throw new NotFoundException
      }
      return {status: 200,  data}
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

}
