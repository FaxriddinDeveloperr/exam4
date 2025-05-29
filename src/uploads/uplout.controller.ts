import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import * as path from 'path';
import { existsSync, mkdirSync } from 'fs';
import { AuthGuard } from 'src/guard/guard.service';
import { Roles } from 'src/Decorator/role.decorator';
import { Role } from 'src/user/dto/register-user.dto';
import { RoleGuard } from 'src/guard/role.guard';

const uploadPath = path.join(__dirname, '..', '..', 'uploads');
if (!existsSync(uploadPath)) {
  mkdirSync(uploadPath, { recursive: true });
}
@ApiTags('File Upload')
@Controller('upload')
export class UploadController {

  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.SELLER)
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          let name = `${Date.now()}${Math.floor(Math.random() * 1000000)}${path.extname(file.originalname)}`;
          cb(null, name);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: Object,
  })
  uploudFile(@UploadedFile() file) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return { name: file.filename };
  }
}