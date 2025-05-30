import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserdto, Role } from './dto/register-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './model/user.model';
import { LoginUserdto } from './dto/login-user.dto';
import { UpdateUserdto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordDto } from './dto/reset_password-user.dto';
import { Request } from 'express';
import { MailService } from 'src/mail/mail.service';
import { totp, authenticator} from 'otplib';
import sequelize from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly Model: typeof User,
    private readonly JWT: JwtService,
    private main: MailService,
  ) {}

  async register(registerUserdto: RegisterUserdto) {
    try {
      authenticator.options = {step: 1200}
      
      const data = await this.Model.findOne({
        where: { email: registerUserdto.email },
      });
      if (data) {
        throw new ConflictException('Email Olredy existes');
      }
      let hash = bcrypt.hashSync(registerUserdto.password, 10);
      registerUserdto.password = hash;

      await this.Model.create({ ...registerUserdto });

      const otp = totp.generate(String(process.env.OTP_SECRET))

      await this.main.sendMail(registerUserdto.email,`Sizning otp kokingiz: ${otp} `," Iltimos, ushbu kodni hech kim bilan bo'lishmang va uni faqat tasdiqlash jarayonida foydalaning." )

      return { Message: "Siz muvofiyaqatliy ro'yhaddan o'tdingiz emailingizga borgan tasdiqlash kodi orqaliy shahsingizni tasdiqlayng!",};

    } catch (error) {
      if (error instanceof HttpException) throw error;
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
      
      if(!data.dataValues.IsActive){
        throw new UnauthorizedException("Siz login qilishdan oldin akkauntingizni follashtiring")
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
      if (error instanceof HttpException) throw error;
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
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number, req: Request) {
    try {
      const users = req['user'];

      const data = await this.Model.findByPk(id);
      if (!data) {
        throw new NotFoundException('Not fount user');
      }

      if (
        users.id == data.dataValues.id ||
        users.role == Role.ADMIN ||
        users.role == Role.SUPER_ADMIN
      ) {
        return { data };
      } else {
        throw new ForbiddenException(
          "Huquqingiz yetarliy emas, siz faqat o'z accauntingizni ko'rishingiz mumkin",
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(updateUserdto: UpdateUserdto, id: number, req: Request) {
    try {
      const users = req['user'];
      const data = await this.Model.findByPk(id);
      if (!data) {
        throw new NotFoundException('Not fount user by id');
      }

      if (
        !(
          data.id == users.id ||
          users.role == Role.ADMIN ||
          users.role == Role.SUPER_ADMIN
        )
      ) {
        throw new UnauthorizedException(
          "Malumotlarni o'zgartirishga huquqingiz yetarliy emas",
        );
      }
      return {
        statuscode: 201,
        Message: 'Update',
        data: await this.Model.update(updateUserdto, {
          where: { id },
          returning: true,
        }),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async reset_password(data: ResetPasswordDto, req: Request) {
    try {
      let users = req['user'];

      const user = await this.Model.findOne({ where: { email: data.email } });
      if (!user) {
        throw new NotFoundException('User not fount by id');
      }
      if (user.dataValues.id !== users.id) {
        throw new UnauthorizedException();
      }

      user.dataValues.password = bcrypt.hashSync(data.password, 10);

      return {
        message: 'Update Password',
        date: await this.Model.update(user.dataValues, {
          where: { id: users.id },
          returning: true,
        }),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async refreshToken(req: Request) {
    try {
      let users = req['user'];
      const data = await this.Model.findByPk(users.id);
      if (!data) {
        throw new UnauthorizedException('Not fount by id');
      }

      const accsestoken = this.AccesToken({ id: data.id, role: data.role });
      return { accsestoken };
    } catch (error) {
      if (error instanceof HttpException) throw error;
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
