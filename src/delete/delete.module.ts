import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/model/user.model';
import { DeleteService } from './delete.service';


@Module({
  imports:[SequelizeModule.forFeature([User])],
  exports: [DeleteService],
  providers:[DeleteService]
})
export class DeleteModule {}

