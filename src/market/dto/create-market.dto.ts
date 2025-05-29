import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMarketDto {
  @ApiProperty({ example: 'FAXA' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  seller_id: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @IsNotEmpty()
  general_reyting: number;

  @ApiProperty({ example: 'description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'reytin_total' })
  @IsString()
  @IsNotEmpty()
  contact: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  follower_count: number;
}
