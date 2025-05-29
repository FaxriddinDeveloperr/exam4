import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'usmonqulovabduhamid00@gmail.com',
        pass: 'cnwydeadbexzniaw',
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    try {
      const message = await this.transporter.sendMail({
        from: 'usmonqulovabduhamid00@gmail.com',
        to,
        subject,
        text,
      });
      return message;
    } catch (error) {
      console.error('Email yuborishda xatolik:', error);
      throw error;
    }
  }
}
