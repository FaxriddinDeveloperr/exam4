import { ApiProperty, OmitType } from '@nestjs/swagger';
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

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  general_reyting: number;

  @ApiProperty({ example: 'description' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: 'reytin_total' })
  @IsString()
  @IsOptional()
  contact: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  follower_count: number;
}
