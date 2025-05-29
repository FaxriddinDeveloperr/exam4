import {
  ConflictException,
  ForbiddenException,
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

@Injectable()
export class AdminService {
  constructor(@InjectModel(User) private readonly Model: typeof User) {}

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
        role: Role.ADMIN
      }
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
      return {statusCode: 200, data };
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
      return {statuscone: 200, data };

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

  async add_Seller(registerUserdto: RegisterUserdto){
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
        role: Role.SELLER
      }
      const newdata = await this.Model.create({ ...Seller });
      return { Message: 'registerd', data: newdata };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
