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
import { totp, authenticator  } from 'otplib';
import { MailService } from 'src/mail/mail.service';

authenticator.options = {window: 10}
@Injectable()
export class VerifyService {
  constructor(
    @InjectModel(User) private readonly Model: typeof User,
    private readonly mail: MailService,
  ) {}


  async VerifyOTP(data: OtpDto) {
    try {
      const user = await this.Model.findOne({ where: { email: data.email } });
      if (!user) {
        throw new NotFoundException('Email topilmadi');
      }
      const Token = data.otp;
      const IsOpt = totp.check(Token, String(process.env.OTP_SECRET))
      
      if (!IsOpt) {
        throw new UnprocessableEntityException('Otp xato kiritilgan');
      }
      user.dataValues.IsActive = true;
      
      await this.Model.update(user.dataValues, { where: { id: user.dataValues.id } });

      return { staatusCode: 201, message: 'Akkauntingiz aktivlashtirildi' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  async SendOtp(gmail: SentGmaildto) {
    try {
      const data = await this.Model.findOne({ where: { email: gmail.email } });
      if (!data) {
        throw new NotFoundException('Gmail not fount');
      }
      const otp = totp.generate(String(process.env.OTP_SECRET))

      await this.mail.sendMail(
        gmail.email,
        `Sizning otp kokingiz:  ${otp} `,
        " Iltimos, ushbu kodni hech kim bilan bo'lishmang va uni faqat tasdiqlash jarayonida foydalaning.",
      );
      return{message: `Quydagi emailga tasdiqlash kodi jo'natildi.  ${gmail.email}`}
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
