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
import { AdminService } from './admin.service';
import { RegisterUserdto, Role } from 'src/user/dto/register-user.dto';
import { UpdateUserdto } from 'src/user/dto/update-user.dto';
import { Request } from 'express';

import { AuthGuard } from 'src/guard/guard.service';
import { Roles } from 'src/Decorator/role.decorator';
import { RoleGuard } from 'src/guard/role.guard';
import { ResetPasswordDto } from 'src/user/dto/reset_password-user.dto';
import { LoginUserdto } from 'src/user/dto/login-user.dto';
import { AdminVerify } from 'src/user/dto/admin.signIn_verify.dt';
import { ApiQuery } from '@nestjs/swagger';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(RoleGuard)
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(AuthGuard)
  @Post('add_admin')
  add_admin(@Body() registerUserdto: RegisterUserdto) {
    return this.adminService.create(registerUserdto);
  }

  @UseGuards(RoleGuard)
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(AuthGuard)
  @Get('all')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'full_name', required: false})
  @ApiQuery({ name: 'phone', required: false})
  @ApiQuery({ name: 'region', required: false})
  @ApiQuery({ name: 'sortBy', required: false, enum: ["region","full_name"] })
  @ApiQuery({ name: 'order', required: true, enum: ['asc', 'desc'] })
  findAll(@Query() query: Record<string, any>) {
    return this.adminService.findAll(query);
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
  @Post('add_seller')
  Add_seller(@Body() data: RegisterUserdto) {
    return this.adminService.add_Seller(data);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete('delet_accaunt_user/:id')
  delet_accaunt(@Param('id') id: string, @Req() req: Request) {
    return this.adminService.delet_accaunt(+id, req);
  }
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('reset_password')
  reset_password(@Body() data: ResetPasswordDto) {
    return this.adminService.reset_password(data);
  }
  @Post('SiginIn')
  SiginIn(@Body() data: LoginUserdto) {
    return this.adminService.SiginIn(data);
  }
  @Post('SignInVerify')
  Verify(@Body() data: AdminVerify) {
    return this.adminService.SignVerify(data);
  }
}
