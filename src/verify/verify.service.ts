import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OtpDto, SentGmaildto } from 'src/user/dto/sentemail-user.dto';
import { User } from 'src/user/model/user.model';
import { totp } from 'otplib';
import { MailService } from 'src/mail/mail.service';
import { catchError } from 'src/utils/chatchError';

@Injectable()
export class VerifyService {
  constructor(
    @InjectModel(User) private readonly Model: typeof User,
    private readonly mail: MailService
  ) {}

  async VerifyOTP(data: OtpDto) {
    try {
      const user = await this.Model.findOne({ where: { email: data.email } });
      if (!user) {
        throw new NotFoundException('Email topilmadi');
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
        throw new UnprocessableEntityException('Otp xato kiritilgan');
      }

      user.dataValues.IsActive = true;
      await this.Model.update(user.dataValues, { where: { id: user.dataValues.id } });

      return { staatusCode: 201, message: 'Akkauntingiz aktivlashtirildi' };
    } catch (error) {
      return catchError(error);
    }
  }

  async SendOtp(gmail: SentGmaildto) {
    try {
      const data = await this.Model.findOne({ where: { email: gmail.email } });
      if (!data) {
        throw new NotFoundException('Gmail not fount');
      }
      const otp = totp.generate(String(data.dataValues.email));

      await this.mail.sendMail(
        gmail.email,
        `Bu Online Marked dan kelgan habar`,
        `<div style="font-family: Arial, sans-serif; padding: 10px; border: 2px solid #ccc;">
          <h4>Iltimos, ushbu kodni hech kim bilan bo'lishmang va uni faqat tasdiqlash jarayonida foydalaning.</h4>
          <h2> <b>Sizning otp kodingiz: </b> <h1>${otp}</h1></h2>
        </div>`
      );
      return {
        message: `Quydagi emailga tasdiqlash kodi jo'natildi.  ${gmail.email}`,
      };
    } catch (error) {
      return catchError(error);
    }
  }
}
