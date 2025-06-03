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
import { SupportTicketService } from './support_ticket.service';
import { CreateSupportTicketDto } from './dto/create-support_ticket.dto';
import { UpdateSupportTicketDto } from './dto/update-support_ticket.dto';
import { AuthGuard } from 'src/guard/guard.service';
import { RoleGuard } from 'src/guard/role.guard';
import { Roles } from 'src/Decorator/role.decorator';
import { Role } from 'src/user/dto/register-user.dto';

@Controller('support-ticket')
export class SupportTicketController {
  constructor(private readonly supportTicketService: SupportTicketService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createSupportTicketDto: CreateSupportTicketDto) {
    return this.supportTicketService.createSupportTicket(
      createSupportTicketDto
    );
  }
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get()
  findAll() {
    return this.supportTicketService.getAllTickets();
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supportTicketService.getTicketById(+id);
  }
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supportTicketService.remove(+id);
  }
}
