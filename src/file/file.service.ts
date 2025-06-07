import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync, unlink } from 'fs';
import { resolve } from 'path';
import { catchError } from 'src/utils/chatchError';

@Injectable()
export class FileService {
  private readonly filePath = resolve(__dirname, '..', '..', '..', 'uplouds');

  async existFile(filename: string): Promise<boolean> {
    try {
      const file = resolve(this.filePath, filename);
      if (existsSync(file)) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw  catchError(error);
    }
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      const file = resolve(this.filePath, filename);
      if (!existsSync(file)) {
        throw new BadRequestException(`File does not exist: ${filename}`);
      }
      await new Promise<void>((res, rej) => {
        unlink(file, (err) => {
          if (err) rej(err);
          res();
        });
      });
    } catch (error) {
      return catchError(error);
    }
  }
}
