import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'usmonqulovabduhamid00@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

