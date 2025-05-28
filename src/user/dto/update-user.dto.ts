import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserdto {
  @ApiProperty({ example: 'Usmonqulov Abduhamid' })
  @IsString()
  @IsOptional()
  full_name: string;

  @ApiProperty({ example: '+998930451852' })
  @IsString()
  @IsOptional()
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({ example: 'usmonqulovabduhamid00@gmail.com' })
  @IsEmail()
  @IsOptional()
  email: string;
}
