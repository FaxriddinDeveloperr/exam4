import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { OrderItemsService } from './order_items.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/guard.service';
import { Request } from 'express';

@ApiTags('Order_Item')
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(@Query() query: Record<string, any>, @Req() req:Request) {
    return this.orderItemsService.findAll(query, req);
  }
  @Get(":id")
  findByid(@Param("id", ParseIntPipe) id: number){
    return this.orderItemsService.findByid(id)
  }
}
