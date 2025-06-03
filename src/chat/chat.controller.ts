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
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { AuthGuard } from 'src/guard/guard.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.createChat(createChatDto);
  }
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.chatService.findAllChat();
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findByIdChat(+id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.deleteChat(+id);
  }
}
