import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserdto } from './dto/register-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  register(@Body() registerUserdto: RegisterUserdto) {
    return this.userService.register(registerUserdto);
  }
  @Post("login")
  login(@Body() registerUserdto: RegisterUserdto) {
    return this.userService.register(registerUserdto);
  }
}