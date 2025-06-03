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
  Query,
} from '@nestjs/common';
import { InfoService } from './info.service';
import { AuthGuard } from 'src/guard/guard.service';
import { RoleGuard } from 'src/guard/role.guard';
import { Roles } from 'src/Decorator/role.decorator';
import { Role } from 'src/user/dto/register-user.dto';
import { Request } from 'express';
import { ApiQuery } from '@nestjs/swagger';

@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.BUYDET)
  @Get('My_data_buydet')
  My_data_buydet(@Req() req: Request) {
    return this.infoService.my_data_buydet(req);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.SELLER)
  @Get('My_data_seller')
  My_data_seller(@Req() req: Request) {
    return this.infoService.my_data_seller(req);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN,Role.SUPER_ADMIN)
  @Get('My_data_admin')
  My_data_admin(@Req() req: Request) {
    return this.infoService.my_data_admin(req);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.SELLER)
  @Get('My_marked_seller')
  My_marked_seller(@Req() req: Request) {
    return this.infoService.my_marked_seller(req);
  }
    @UseGuards(RoleGuard)
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @UseGuards(AuthGuard)
    @Get('All')
    @ApiQuery({name: 'page', required: false, example: 1})
    @ApiQuery({name: 'limit', required: false, example: 10})
    @ApiQuery({ name: 'full_name', required: false})
    @ApiQuery({ name: 'phone', required: false})
    @ApiQuery({ name: 'region', required: false})
    @ApiQuery({name: "sortBy", required: false, enum: ["region","full_name"]})
    @ApiQuery({ name: 'order', required: true, enum: ['asc', 'desc'] })
    findAll(@Query() query: Record<string, any>) {
      return this.infoService.findAll(query);
    }
}
