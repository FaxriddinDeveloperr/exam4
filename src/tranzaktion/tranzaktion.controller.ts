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
import { TranzaktionService } from './tranzaktion.service';
import { CreateTranzaktionDto } from './dto/create-tranzaktion.dto';
import { AuthGuard } from 'src/guard/guard.service';
import { RoleGuard } from 'src/guard/role.guard';
import { Roles } from 'src/Decorator/role.decorator';
import { Role } from 'src/user/dto/register-user.dto';

@Controller('tranzaktion')
export class TranzaktionController {
  constructor(private readonly tranzaktionService: TranzaktionService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createTranzaktionDto: CreateTranzaktionDto) {
    return this.tranzaktionService.create(createTranzaktionDto);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get()
  findAll() {
    return this.tranzaktionService.findAll();
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tranzaktionService.findOne(+id);
  }
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tranzaktionService.remove(+id);
  }
}
