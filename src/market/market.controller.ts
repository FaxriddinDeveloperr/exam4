import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MarketService } from './market.service';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Post()
  create(@Body() createMarketDto: CreateMarketDto) {
    return this.marketService.createMarket(createMarketDto);
  }

  @Get()
  findAll() {
    return this.marketService.findAllMarket();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketService.findByIdMarket(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarketDto: UpdateMarketDto) {
    return this.marketService.updateMarket(+id, updateMarketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketService.deleteMarket(+id);
  }
}
