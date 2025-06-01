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
import { totp } from 'otplib';
import { EmailPassword } from './dto/Email_reset_password';
import { Op } from 'sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly Model: typeof User,
    private readonly JWT: JwtService,
    private main: MailService
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

      await this.Model.create({ ...registerUserdto });

      const otp = totp.generate(String(registerUserdto.email));

      await this.main.sendMail(
        registerUserdto.email,
        `Bu Online Marked dan kelgan habar`,
        `<div style="font-family: Arial, sans-serif; padding: 10px; border: 2px solid #ccc;">
          <h4>Iltimos, Ushbu kodni hech kim bilan bo'lishmang va uni faqat tasdiqlash jarayonida foydalaning.</h4>
          <h2> <b>Sizning tasdiqlash kokingiz: </b> <h1>${otp}</h1></h2>
        </div>`
      );

      return {
        Message:
          "Siz muvofiyaqatliy ro'yhaddan o'tdingiz emailingizga borgan tasdiqlash kodi orqaliy shahsingizni tasdiqlayng!",
      };
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

      if (!data.dataValues.IsActive) {
        throw new UnauthorizedException(
          'Siz login qilishdan oldin akkauntingizni follashtiring'
        );
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

  async findAll(query: Record<string, any>) {
    try {
      let {
        page,
        limit,
        full_name,
        phone,
        region,
        sortBy,
        order,
      } = query;
  
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      const offset = (page - 1) * limit;
      const sortColumn = sortBy || 'full_name';
      const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
  
      const where: any = {};
  
      if (full_name) {
        where.full_name = { [Op.iLike]: `%${full_name}%` };
      }
  
      if (phone) {
        where.phone = { [Op.iLike]: `%${phone}%` };
      }
  
      if (region) {
        where.region = { [Op.iLike]: `%${region}%` };
      }
  
      const { count: total, rows: data } = await this.Model.findAndCountAll({
        where,
        order: [[sortColumn, sortOrder]],
        limit,
        offset,
      });
  
      return {
        total,
        page,
        limit,
        data,
      };
    } catch (error) {
      return { message: error.message || 'Xatolik yuz berdi' };
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
          "Huquqingiz yetarliy emas, siz faqat o'z accauntingizni ko'rishingiz mumkin"
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
          "Malumotlarni o'zgartirishga huquqingiz yetarliy emas"
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
  async reset_password(data: ResetPasswordDto) {
    try {
      const user = await this.Model.findOne({ where: { email: data.email } });
      if (!user) {
        throw new NotFoundException('User not fount by id');
      }
      let token = this.EmailToken({ email: data.email });

      const resetLink = `https://usmonqulov-abduhamid-5018844.github.io/reset_password/?token=${token}`;

      await this.main.sendMail(
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
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async new_password(data: EmailPassword) {
    console.log(data);

    try {
      const token = this.JWT.verify(data.token, {
        secret: String(process.env.EMAIL_SECRET),
      });
      console.log(token);

      try {
        const userPass = await this.Model.findOne({
          where: { email: token.email },
        });
        if (!userPass) {
          throw new NotFoundException('User topilmadi');
        }
        let hashpass = bcrypt.hashSync(data.password, 10);
        userPass.dataValues.password = hashpass;

        await this.Model.update(userPass.dataValues, {
          where: { email: userPass.dataValues.email },
        });
        return {
          statuscode: 201,
          message: "Parol muvaffaqiyatli o'zgartirildi!",
        };
      } catch (error) {
        if (error instanceof HttpException) throw error;
        throw new InternalServerErrorException(error.message);
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new UnauthorizedException('Token vaxti tugadi');
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

  EmailToken(peloud: { email: string }) {
    return this.JWT.sign(peloud, {
      secret: process.env.EMAIL_SECRET,
      expiresIn: '2m',
    });
  }
}
