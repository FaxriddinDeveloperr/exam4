import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './model/notification.model';
import { User } from 'src/user/model/user.model';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification)
    private readonly NotifikationModel: typeof Notification,
    @InjectModel(User) private readonly UserModel: typeof User,
    private readonly mail: MailService
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    try {
      const data = await this.UserModel.findByPk(createNotificationDto.userId);
      if (!data) {
        throw new NotFoundException('Not Fount user');
      }
      const creted = await this.NotifikationModel.create({
        ...createNotificationDto,
      });
      let email = data.dataValues.email
      let {type, message} = createNotificationDto

      await this.mail.sendMail(email,type,`<div><h4 style="color:rgb(79, 146, 217)">${message}</h4></div>`)

      return { message: 'creted', data: creted };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  findAll() {
    return `This action returns all notification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
