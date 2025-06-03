import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from 'src/guard/guard.service';
import { RoleGuard } from 'src/guard/role.guard';
import { Roles } from 'src/Decorator/role.decorator';
import { Role } from 'src/user/dto/register-user.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.createComment(createCommentDto);
  }

  @Get()
  findAll() {
    return this.commentService.findAllComment();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findByIdComment(+id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.deleteChat(+id);
  }
}
