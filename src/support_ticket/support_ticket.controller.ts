import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SupportTicketService } from './support_ticket.service';
import { CreateSupportTicketDto } from './dto/create-support_ticket.dto';
import { UpdateSupportTicketDto } from './dto/update-support_ticket.dto';

@Controller('support-ticket')
export class SupportTicketController {
  constructor(private readonly supportTicketService: SupportTicketService) {}

  @Post()
  create(@Body() createSupportTicketDto: CreateSupportTicketDto) {
    return this.supportTicketService.createSupportTicket(createSupportTicketDto);
  }

  @Get()
  findAll() {
    return this.supportTicketService.getAllTickets();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supportTicketService.getTicketById(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supportTicketService.remove(+id);
  }
}
