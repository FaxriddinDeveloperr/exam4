import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { MarketService } from './market.service';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { AuthGuard } from 'src/guard/guard.service';
import { RoleGuard } from 'src/guard/role.guard';
import { Roles } from 'src/Decorator/role.decorator';
import { Role } from 'src/user/dto/register-user.dto';
import { Request } from 'express';
import { ApiQuery } from '@nestjs/swagger';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.SELLER)
  @Post()
  create(@Body() createMarketDto: CreateMarketDto, @Req() req: Request) {
    return this.marketService.createMarket(createMarketDto, req);
  }

  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'description', required: false })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['name'] })
  @ApiQuery({ name: 'order', required: true, enum: ['asc', 'desc'] })
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: Request, @Query() query: Record<string, any>) {
    return this.marketService.findAllMarket(req, query)
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.marketService.findByIdMarket(id);
  }
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.SELLER)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMarketDto: UpdateMarketDto,
    @Req() req: Request
  ) {
    return this.marketService.updateMarket(id, updateMarketDto, req);
  }
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.SELLER, Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.marketService.deleteMarket(id, req);
  }
}
