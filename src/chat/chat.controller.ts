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
  Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { AuthGuard } from 'src/guard/guard.service';
import { Request } from 'express';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createChatDto: CreateChatDto, @Req() req:Request) {
    return this.chatService.createChat(createChatDto, req);
  }
  
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.chatService.findAllChat();
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id: number) {
    return this.chatService.findByIdChat(id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.deleteChat(id);
  }
}
