import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, Status, StatusDto } from './dto/create-order.dto';
import { AuthGuard } from 'src/guard/guard.service';
import { Roles } from 'src/Decorator/role.decorator';
import { RoleGuard } from 'src/guard/role.guard';
import { Role } from 'src/user/dto/register-user.dto';
import { Request } from 'express';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto,@Req() req:Request) {
    return this.orderService.create(createOrderDto,req);
  }
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.orderService.findAll(req);
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.orderService.findOne(id, req);
  }
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch('Status_Update/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() status: StatusDto) {
    return this.orderService.Update_Status(id, status);
  }
}
