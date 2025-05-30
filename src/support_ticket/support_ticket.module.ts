import { Module } from '@nestjs/common';
import { SupportTicketService } from './support_ticket.service';
import { SupportTicketController } from './support_ticket.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SupportTicket } from './model/support_ticket.model';

@Module({
  imports:[SequelizeModule.forFeature([SupportTicket])],
  controllers: [SupportTicketController],
  providers: [SupportTicketService],
})
export class SupportTicketModule {}
