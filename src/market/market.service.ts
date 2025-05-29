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
        throw new NotFoundException('No markets found');
      }

      return {
        statusCode: 200,
        message: 'All markets found',
        data,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByIdMarket(id: number) {
    try {
      const market = await this.model.findByPk(id);

      if (!market) {
        throw new NotFoundException(`Market with ID ${id} not found`);
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
      const market = await this.model.findByPk(id);
      if (!market) {
        throw new NotFoundException(`Market with ID ${id} not found`);
      }

      const [affectedCount, affectedRows] = await this.model.update(
        updateMarketDto,
        {
          where: { id },
          returning: true,
        },
      );

      return {
        statusCode: 200,
        message: 'Market updated successfully',
        data: affectedRows[0],
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteMarket(id: number) {
    try {
      const market = await this.model.findByPk(id);
      if (!market) {
        throw new NotFoundException(`Market with ID ${id} not found`);
      }

      await this.model.destroy({ where: { id } });

      return {
        statusCode: 200,
        message: 'Market deleted successfully',
        data: {},
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
