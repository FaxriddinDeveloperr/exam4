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
import { TranzaktionService } from './tranzaktion.service';
import { CreateTranzaktionDto } from './dto/create-tranzaktion.dto';
import { AuthGuard } from 'src/guard/guard.service';
import { RoleGuard } from 'src/guard/role.guard';
import { Roles } from 'src/Decorator/role.decorator';
import { Role } from 'src/user/dto/register-user.dto';
import { Request } from 'express';

@Controller('tranzaktion')
export class TranzaktionController {
  constructor(private readonly tranzaktionService: TranzaktionService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createTranzaktionDto: CreateTranzaktionDto, @Req() req:Request) {
    return this.tranzaktionService.create(createTranzaktionDto, req);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.BUYDET)
  @Get()
  findAll() {
    return this.tranzaktionService.findAll();
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id: number, @Req() req:Request) {
    return this.tranzaktionService.findOne(id, req);
  }
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.tranzaktionService.remove(id);
  }
}
