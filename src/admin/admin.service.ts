import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
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
import { LoginUserdto } from 'src/user/dto/login-user.dto';
import { catchError } from 'src/utils/chatchError';
import { totp } from 'otplib';
import { AdminVerify } from 'src/user/dto/admin.signIn_verify.dt';
import { Op } from 'sequelize';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User) private readonly Model: typeof User,
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
      return catchError(error);
    }
  }

  async findAll(query: Record<string, any>) {
    try {
      let { limit, page, order, sortBy, region, phone, full_name } = query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      const offset = (page - 1) * limit;
      const sortColum = sortBy || 'full_name';
      const sortorder = order == 'asc' ? 'ASC' : 'DESC';

      const where: any = {};
      if (region) {
        where.region = { [Op.iLike]: `%${region}%` };
      }
      if (phone) {
        where.phone = { [Op.iLike]: `%${phone}%` };
      }
      if (full_name) {
        where.full_name = { [Op.iLike]: `%${full_name}%` };
      }
      where.role = { [Op.in]: [Role.SUPER_ADMIN, Role.ADMIN] };
      
      const { count: total, rows: data } = await this.Model.findAndCountAll({
        where,
        order: [[sortColum, sortorder]],
        limit,
        offset,
      });
      return { statusCode: 200, total, page, limit, data };
    } catch (error) {
      return catchError(error);
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
      return catchError(error);
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
      return catchError(error);
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
          <h3><a href="${resetLink}">Reset Password</a></h3>`
      );
      return {
        statusCode: 201,
        message: 'Parolingizni tiklash uchun emailingizga xabar yuborildi',
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async delet_accaunt(id: number, req: Request) {
    try {
      const users = req['user'];

      const data = await this.Model.findByPk(id);
      if (!data) {
        throw new NotFoundException('Not fount user by id');
      }
      if (users.role === Role.SUPER_ADMIN && users.id !== data.dataValues.id) {
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
      } else {
        throw new ForbiddenException(
          "Sizda bu foydalanuvchini o'chirishga ruxsatingiz yo'q"
        );
      }
    } catch (error) {
      return catchError(error);
    }
  }
  async SiginIn(data: LoginUserdto) {
    try {
      const user = await this.Model.findOne({ where: { email: data.email } });
      if (!user) {
        throw new NotFoundException('Not Fount user');
      }
      if (!bcrypt.compareSync(data.password, user.dataValues.password)) {
        throw new UnprocessableEntityException('Wrong passvord');
      }
      let otp = totp.generate(String(data.email));
      await this.mail.sendMail(
        data.email,
        'Sizning Hisobingizga kirish uchun tasdiqlash kodi',
        `<h2>Token: <b>${otp}</b></h2>`
      );
      return {
        message: `Hisobingizni tasdiqlash ushun ushbu emailga xabar jo'natildi,  ${data.email}`,
      };
    } catch (error) {
      return catchError(error);
    }
  }
  async SignVerify(data: AdminVerify) {
    try {
      let user = await this.Model.findOne({ where: { email: data.email } });
      if (!user) {
        throw new NotFoundException('Not fount email');
      }
      const speakeasy = require('speakeasy');
      const Token = data.otp;
      const isOtpValid = speakeasy.totp.verify({
        secret: String(user.dataValues.email),
        encoding: 'ascii',
        token: Token,
        window: 3,
      });
      if (!isOtpValid) {
        throw new UnprocessableEntityException('Wrong Otp');
      }
      user.dataValues.IsActive = true;
      await this.Model.update(user, { where: { email: data.email } });

      const accsestoken = this.jwt.AccesToken({
        id: user.dataValues.id,
        role: user.dataValues.role,
      });
      const refreshToken = this.jwt.RefreshToken({
        id: user.dataValues.id,
        role: user.dataValues.role,
      });
      return { accsestoken, refreshToken };
    } catch (error) {
      return catchError(error);
    }
  }
}
