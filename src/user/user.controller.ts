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
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { EmailPassword } from './dto/Email_reset_password';

@ApiTags('Auth')
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
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(AuthGuard)
  @Get('all')
  @ApiQuery({name: 'page', required: false, example: 1})
  @ApiQuery({name: 'limit', required: false, example: 10})
  @ApiQuery({ name: 'full_name', required: false, example: 'alex' })
  @ApiQuery({ name: 'phone', required: false, example: '+998930451852'})
  @ApiQuery({ name: 'region', required: false, example: 'Toshkent' })
  @ApiQuery({name: "sortBy", required: false, example: "region"})
  @ApiQuery({ name: 'order', required: true, enum: ['asc', 'desc'] })
  findAll(@Query() query: Record<string, any>) {
    return this.userService.findAll(query);
  }

  @UseGuards(RefreshGuard)
  @Get('refreshToket')
  refreshToken(@Req() req: Request) {
    return this.userService.refreshToken(req);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  finfOne(@Param('id') id: string, @Req() req: Request) {
    return this.userService.findOne(+id, req);
  }
  @Post('password')
  new_password(@Body() data: EmailPassword) {
    return this.userService.new_password(data);
  }

  @Post('reset_password')
  reset_password(@Body() data: ResetPasswordDto) {
    return this.userService.reset_password(data);
  }

  @UseGuards(AuthGuard)
  @Patch('Update/:id')
  update(
    @Body() data: UpdateUserdto,
    @Param('id') id: string,
    @Req() req: Request
  ) {
    return this.userService.update(data, +id, req);
  }
}
