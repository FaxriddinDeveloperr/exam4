import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { Market } from './model/market.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class MarketService {
  constructor(@InjectModel(Market) private model: typeof Market) {}

  async createMarket(createMarketDto: CreateMarketDto) {
    try {
      const market = await this.model.create({ ...createMarketDto });

      return {
        statusCode: 201,
        message: 'Market successfully created',
        data: market,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllMarket() {
    try {
      const data = await this.model.findAll();
      if (!data.length) {
        throw new NotFoundException();
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByIdMarket(id: number) {
    try {
      const market = await this.model.findByPk(id);
      if (!market) {
        throw new NotFoundException(`Market  whith ID ${id} not found`);
      }
      return {
        statusCode: 200,
        message: 'Market found',
        data: market,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateMarket(id: number, updateMarketDto: UpdateMarketDto) {
    try {
      const markets = await this.model.findByPk(id);
      if (!markets) {
        throw new NotFoundException();
      }
      const data = await this.model.update(updateMarketDto, {
        where: { id },
        returning: true,
      });
      return data[1][0];
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteMarket(id: number) {
    try {
      await this.model.destroy({ where: { id } });
      return { data: {} };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
