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
import { UserService } from './user.service';
import { RegisterUserdto, Role } from './dto/register-user.dto';
import { LoginUserdto } from './dto/login-user.dto';
import { ResetPasswordDto } from './dto/reset_password-user.dto';
import { AuthGuard } from 'src/guard/guard.service';
import { Request } from 'express';
import { RoleGuard } from 'src/guard/role.guard';
import { Roles } from 'src/Decorator/role.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() registerUserdto: RegisterUserdto) {
    return this.userService.register(registerUserdto);
  }

  @Post('login')
  login(@Body() loginUserdto: LoginUserdto) {
    return this.userService.login(loginUserdto);
  }
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  finfOne(@Param('id') id: string, @Req() req: Request) {
    return this.userService.findOne(+id, req);
  }

  @UseGuards(AuthGuard)
  @Delete('delet_accaunt/:id')
  delet_accaunt(@Param('id') id: string, @Req() req: Request) {
    return this.userService.delet_accaunt(+id, req);
  }

  @UseGuards(AuthGuard)
  @Post('reset_password')
  reset_password(@Body() data: ResetPasswordDto, @Req() req: Request) {
    return this.userService.reset_password(data, req);
  }
}
