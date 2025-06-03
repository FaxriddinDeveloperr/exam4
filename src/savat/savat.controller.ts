import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { SavatService } from './savat.service';
import { CreateSavatDto } from './dto/create-savat.dto';
import { AuthGuard } from 'src/guard/guard.service';
import { Request } from 'express';
import { RoleGuard } from 'src/guard/role.guard';
import { Role } from 'src/user/dto/register-user.dto';
import { Roles } from 'src/Decorator/role.decorator';

@Controller('savat')
export class SavatController {
  constructor(private readonly savatService: SavatService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.BUYDET)
  @Post()
  create(@Body() createSavatDto: CreateSavatDto, @Req() req: Request) {
    return this.savatService.create(createSavatDto, req);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.savatService.findAll(req);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.savatService.remove(id, req);
  }
}
