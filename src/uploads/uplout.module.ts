import { Module } from '@nestjs/common';
import { UploadController } from './uplout.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[],
  controllers: [UploadController],
  providers: [],
})
export class UploutModule {}
