import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserdto } from './dto/register-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './model/user.model';
import { LoginUserdto } from './dto/login-user.dto';
import { UpdateUserdto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { tracingChannel } from 'diagnostics_channel';
import { ResetPasswordDto } from './dto/reset_password-user.dto';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly Model: typeof User,
    private readonly JWT: JwtService
  ) {}

  async register(registerUserdto: RegisterUserdto) {
    try {
      const data = await this.Model.findOne({
        where: { email: registerUserdto.email },
      });
      if (data) {
        throw new ConflictException('Email Olredy existes');
      }
      let hash = bcrypt.hashSync(registerUserdto.password, 10);
      registerUserdto.password = hash;

      const newUser = await this.Model.create({ ...registerUserdto });
      return { Message: 'registerd', data: newUser };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async login(loginUserdto: LoginUserdto) {
    try {
      const data = await this.Model.findOne({
        where: { email: loginUserdto.email },
      });
      if (!data) {
        throw new NotFoundException('User Not fount');
      }
      if (
        !bcrypt.compareSync(loginUserdto.password, data.dataValues.password)
      ) {
        throw new NotFoundException('Wrong password');
      }

      const accsestoken = this.AccesToken({
        id: data.dataValues.id,
        role: data.dataValues.role,
      });

      const refreshtoken = this.RefreshToken({
        id: data.dataValues.id,
        role: data.dataValues.role,
      });

      return { accsestoken, refreshtoken };
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      const data = await this.Model.findAll();
      if (!data.length) {
        throw new NotFoundException('Not fount user');
      }
      return { data };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number, req: Request) {
    try {
      const userId = req['user'];

      const data = await this.Model.findByPk(id);
      if (!data) {
        throw new NotFoundException('Not fount user');
      }

      if (
        userId == data.dataValues.id ||
        data.dataValues.role == 'admin' ||
        data.dataValues.role == 'super_admin'
      ) {
        return { data };
      } else {
        throw new ForbiddenException(
          "Huquqingiz yetarliy emas, siz faqat o'z accauntingizni ko'rishingiz mumkin"
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //  async update(id: number, updateUserdto: UpdateUserdto) {
  //     return `This action updates a #${id} user`;
  //   }

  async delet_accaunt(id: number, req: Request) {
    try {
      const userId = req['user'];

      const data = await this.Model.findByPk(id);
      if (!data) {
        throw new NotFoundException('Not fount user by id');
      }
      if (
        !(
          data.dataValues.id == userId ||
          data.dataValues.role == 'admin' ||
          data.dataValues.role == 'super_admin'
        )
      ) {
        throw new ForbiddenException();
      }
      await this.Model.destroy({ where: { id } });
      return { Message: 'Deleted', data: {} };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async reset_password(data: ResetPasswordDto, req: Request) {
    try {
      let userId = req['user'];
      const user = await this.Model.findOne({ where: { email: data.email } });
      if (!user) {
        throw new NotFoundException('User not fount by id');
      }
      if (user.dataValues.id !== userId) {
        throw new UnauthorizedException();
      }
      user.dataValues.password = data.password;
      let newData = await this.Model.update(user, {
        where: { id: userId },
        returning: true,
      });

      return { statuscode: 201, message: 'Update Password', data: newData };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  AccesToken(peloud: { id: string; role: string }) {
    return this.JWT.sign(peloud, {
      secret: process.env.ACCS_SECRET,
      expiresIn: '1h',
    });
  }
  RefreshToken(peloud: { id: string; role: string }) {
    return this.JWT.sign(peloud, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: '7h',
    });
  }
}
