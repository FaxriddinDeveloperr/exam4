import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/model/user.model';
import { RegisterUserdto, Role } from 'src/user/dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';

import { UpdateUserdto } from 'src/user/dto/update-user.dto';
import { ResetPasswordDto } from 'src/user/dto/reset_password-user.dto';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AdminService {
  constructor(@InjectModel(User) private readonly Model: typeof User,
  private readonly jwt: UserService,
  private readonly mail: MailService
) {}

  async create(registerUserdto: RegisterUserdto) {
    try {
      const data = await this.Model.findOne({
        where: { email: registerUserdto.email },
      });
      if (data) {
        throw new ConflictException('Email Olredy existes');
      }
      let hash = bcrypt.hashSync(registerUserdto.password, 10);
      registerUserdto.password = hash;
      const admin = {
        ...registerUserdto,
        role: Role.ADMIN,
      };
      const newUser = await this.Model.create({ ...admin });
      return { Message: 'registerd', data: newUser };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      const data = await this.Model.findAll();
      if (!data.length) {
        throw new NotFoundException('Not fount user');
      }
      return { statusCode: 200, data };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.Model.findByPk(id);
      if (!data) {
        throw new NotFoundException('Not fount user');
      }
      return { statuscone: 200, data };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateUserdto: UpdateUserdto) {
    try {
      const data = await this.Model.findByPk(id);
      if (!data) {
        throw new NotFoundException('Not fount admin by id');
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
      throw new InternalServerErrorException(error.message);
    }
  }

  async add_Seller(registerUserdto: RegisterUserdto) {
    try {
      const data = await this.Model.findOne({
        where: { email: registerUserdto.email },
      });
      if (data) {
        throw new ConflictException('Email Olredy existes');
      }
      let hash = bcrypt.hashSync(registerUserdto.password, 10);
      registerUserdto.password = hash;
      const Seller = {
        ...registerUserdto,
        role: Role.SELLER,
      };
      const newdata = await this.Model.create({ ...Seller });
      return { Message: 'registerd', data: newdata };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

   async reset_password(data: ResetPasswordDto) {
      try {
        const user = await this.Model.findOne({ where: { email: data.email } });
        if (!user) {
          throw new NotFoundException('User not fount by id');
        }
        let token = this.jwt.EmailToken({ email: data.email });
  
        const resetLink = `https://usmonqulov-abduhamid-5018844.github.io/reset_password/?token=${token}`;
  
        await this.mail.sendMail(
          data.email,
          `Email tasdiqlash`,
          `<h2><b>Parolni tiklash uchun quyidagi havolani bosing:</b></h2>
          <a href="${resetLink}">Reset Password</a>`
        );
        return {statusCode: 201, message: "Parolingizni tiklash uchun emailingizga xabar yuborildi"}
      } catch (error) {
        if (error instanceof HttpException) throw error;
        throw new InternalServerErrorException(error.message);
      }
    }

  async delet_accaunt(id: number, req: Request) {
    try {
      const users = req['user'];

      const data = await this.Model.findByPk(id);
      if (!data) {
        throw new NotFoundException('Not fount user by id');
      }
      if (
        users.role === Role.SUPER_ADMIN &&
        users.id !== data.dataValues.id
      ) {
        await this.Model.destroy({ where: { id } });
        return { Message: 'Deleted', data: {} };
      } else if (
        users.role === Role.ADMIN &&
        data.dataValues.id !== users.id &&
        data.dataValues.role !== Role.SUPER_ADMIN &&
        data.dataValues.role !== Role.ADMIN
      ) {
        await this.Model.destroy({ where: { id } });
        return { Message: 'Deleted', data: {} };
      }
      else{
        throw new ForbiddenException("Sizda bu foydalanuvchini o'chirishga ruxsatingiz yo'q")
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
