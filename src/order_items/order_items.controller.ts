import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderItemsService } from './order_items.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Order_Item")
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Get()
  findAll() {
    return this.orderItemsService.findAll();
  }

}
