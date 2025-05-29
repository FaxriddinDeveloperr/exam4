import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SavatService } from './savat.service';
import { CreateSavatDto } from './dto/create-savat.dto';

@Controller('savat')
export class SavatController {
  constructor(private readonly savatService: SavatService) {}

  @Post()
  create(@Body() createSavatDto: CreateSavatDto) {
    return this.savatService.create(createSavatDto);
  }

  @Get()
  findAll() {
    return this.savatService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.savatService.remove(+id);
  }
}
