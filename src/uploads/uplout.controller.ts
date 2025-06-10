import {
  BadRequestException,
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
import { Request } from 'express';

const uploadPath = path.join(process.cwd(),'..','uploads');

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
        destination: (
          req: Request,
          file,
          cb: (error: Error | null, destination: string) => void
        ) => {
          cb(null, uploadPath);
        },
        filename: (
          req: Request,
          file,
          cb: (error: Error | null, destination: string) => void
        ) => {
          let name = `${Date.now()}${Math.floor(Math.random() * 1000000)}${path.extname(file.originalname)}`;
          cb(null, name);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedExtensions = [
          '.jpeg',
          '.png',
          '.jpg',
          '.svg',
          '.heic',
          '.webp',
        ];
        const ext = path.extname(file.originalname).toLowerCase();

        if (allowedExtensions.includes(ext)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              `Only allowed files: ${allowedExtensions.join(', ')}`
            ),
            false
          );
        }
      },
    })
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
