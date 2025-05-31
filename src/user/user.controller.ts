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
import { UpdateUserdto } from './dto/update-user.dto';
import { RefreshGuard } from 'src/guard/Refresh_guard.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Auth")
@Controller('Auth')
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

  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN,Role.SUPER_ADMIN)
  @UseGuards(AuthGuard)
  @Get("all")
  findAll(){
    return this.userService.findAll()
  }

  @UseGuards(RefreshGuard)
  @Get("refreshToket")
  refreshToken(@Req() req: Request){
    return this.userService.refreshToken(req)
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  finfOne(@Param('id') id: string, @Req() req: Request) {
    return this.userService.findOne(+id, req);
  }


  @UseGuards(AuthGuard)
  @Post('reset_password')
  reset_password(@Body() data: ResetPasswordDto, @Req() req: Request) {
    
    return this.userService.reset_password(data, req);
  }


  @UseGuards(AuthGuard)
  @Patch("Update/:id")
  update(@Body() data: UpdateUserdto, @Param("id") id: string, @Req() req:Request){
    return this.userService.update(data, +id, req)
  }

}
