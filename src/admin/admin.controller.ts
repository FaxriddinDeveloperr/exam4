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
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { RegisterUserdto, Role } from 'src/user/dto/register-user.dto';
import { UpdateUserdto } from 'src/user/dto/update-user.dto';
import { Request } from 'express';

import { AuthGuard } from 'src/guard/guard.service';
import { Roles } from 'src/Decorator/role.decorator';
import { RoleGuard } from 'src/guard/role.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(RoleGuard)
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(AuthGuard)
  @Post('add_admin')
  create(@Body() registerUserdto: RegisterUserdto) {
    return this.adminService.create(registerUserdto);
  }

  @UseGuards(RoleGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(AuthGuard)
  @Get("all")
  findAll() {
    return this.adminService.findAll();
  }

  @UseGuards(RoleGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @UseGuards(RoleGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserdto: UpdateUserdto) {
    return this.adminService.update(+id, updateUserdto);
  }

  @UseGuards(RoleGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(AuthGuard)
  @Post("add_seller")
  Add_seller(@Body() data: RegisterUserdto){
    return this.adminService.add_Seller(data)
  }
}
