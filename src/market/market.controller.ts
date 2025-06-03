import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MarketService } from './market.service';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { AuthGuard } from 'src/guard/guard.service';
import { RoleGuard } from 'src/guard/role.guard';
import { Roles } from 'src/Decorator/role.decorator';
import { Role } from 'src/user/dto/register-user.dto';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.SELLER)
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
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.SELLER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarketDto: UpdateMarketDto) {
    return this.marketService.updateMarket(+id, updateMarketDto);
  }
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.SELLER, Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketService.deleteMarket(+id);
  }
}
