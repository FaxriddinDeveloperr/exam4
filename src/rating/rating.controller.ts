import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { AuthGuard } from 'src/guard/guard.service';
import { Roles } from 'src/Decorator/role.decorator';
import { Role } from 'src/user/dto/register-user.dto';
import { RoleGuard } from 'src/guard/role.guard';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingService.createRaring(createRatingDto);
  }

  @Get()
  findAll() {
    return this.ratingService.getAllRatings();
  }

  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id: number) {
    return this.ratingService.getRatingById(id);
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id',ParseIntPipe) id: number, @Body() updateRatingDto: UpdateRatingDto) {
    return this.ratingService.updateRatignById(id, updateRatingDto);
  }
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.ratingService.deleteRatingById(id);
  }
}
