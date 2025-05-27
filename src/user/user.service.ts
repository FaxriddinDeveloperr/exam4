import { Injectable } from '@nestjs/common';
import { RegisterUserdto } from './dto/register-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './model/user.model';
import { LoginUserdto } from './dto/login-user.dto';
import { UpdateUserdto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly Model: typeof User) {}

  register(registerUserdto: RegisterUserdto) {
    return 'This action adds a new user';
  }

  login(loginUserdto: LoginUserdto) {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserdto: UpdateUserdto) {
    return `This action updates a #${id} user`;
  }

  delet_acount(id: number) {
    return `This action removes a user`;
  }
}
