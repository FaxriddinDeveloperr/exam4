import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import * as nodemailer from "nodemailer"

@Module({
  exports:[MailService],
  providers: [MailService],
})
export class MailModule {}
