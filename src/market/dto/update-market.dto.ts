import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UpdateMarketDto {
  @ApiProperty({ example: 'FAXA' })
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  seller_id: number;

  general_reyting: number;
  description: string;
  contact: string;
  follower_count: number;
}
