import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SentGmaildto {
  @ApiProperty({ example: 'usmonqulovabduhamid00@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
export class OtpDto {
  @ApiProperty({ example: 'usmonqulovabduhamid00@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 234536 })
  @IsNotEmpty()
  @IsString()
  otp: string;
}
