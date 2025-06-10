import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum Role {
  BUYDET = 'buydet',
  SELLER = 'seller',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export class RegisterUserdto {
  @ApiProperty({ example: 'Usmonqulov Abduhamid' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: '+998930451852' })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({ example: 'usmonqulovabduhamid00@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '50803006730015' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Toshkent' })
  @IsString()
  @IsNotEmpty()
  region: string;
}
