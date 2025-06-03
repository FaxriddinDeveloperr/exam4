import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, Status, StatusDto } from './dto/create-order.dto';
import { AuthGuard } from 'src/guard/guard.service';
import { Roles } from 'src/Decorator/role.decorator';
import { RoleGuard } from 'src/guard/role.guard';
import { Role } from 'src/user/dto/register-user.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.orderService.findAll();
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch('Status_Update/:id')
  update(@Param('id') id: string, @Body() status: StatusDto) {
    return this.orderService.Update_Status(+id, status);
  }
}
