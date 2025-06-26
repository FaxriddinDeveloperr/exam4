import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/model/user.model';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Op } from 'sequelize';


@Injectable()
export class DeleteService {
  constructor(@InjectModel(User) private readonly Model: typeof User){}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT,{
    timeZone: 'Asia/Tashkent',
  })
  async handleUserCleanup() {
    const now = new Date();
    const date = new Date(now.getTime() - 48 * 60 * 60 * 1000);
      await this.Model.destroy({
      where: {
        IsActive: false,
        createdAt: {
          [Op.lt]: date,
        },
      },
    });
 }
}
