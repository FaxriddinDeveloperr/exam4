import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
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
      let email = data.dataValues.email;
      let { type, message } = createNotificationDto;

      await this.mail.sendMail(
        email,
        type,
        `<div><h3 style="color:rgb(79, 146, 217)">${message}</h3></div>`
      );

      return { message: 'creted', data: creted };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      const data = await this.NotifikationModel.findAll();
      if (!data.length) {
        throw new NotFoundException();
      }
      return { statusCode: 200, data };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.NotifikationModel.findByPk(id);
      if (!data) {
        throw new NotFoundException();
      }
      return {statusCode: 200, data}
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const data = await this.NotifikationModel.findByPk(id);
      if (!data) {
        throw new NotFoundException();
      }
      await this.NotifikationModel.destroy({ where: { id: id } });
      return { statusCode: 200, message: 'Deleted' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }
}
