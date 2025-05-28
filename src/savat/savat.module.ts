import { Module } from '@nestjs/common';
import { SavatService } from './savat.service';
import { SavatController } from './savat.controller';

@Module({
  controllers: [SavatController],
  providers: [SavatService],
})
export class SavatModule {}
