import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMarketDto {
  @ApiProperty({ example: 'FAXA' })
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty({ example: 'ID' })
  @IsNumber()
  seller_id: number;

  @ApiProperty({ example: 'reytin_total' })
  @IsNumber()
  general_reyting: number;

  @ApiProperty({ example: 'description' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'reytin_total' })
  @IsString()
  contact: string;

  @ApiProperty({ example: 'follower_count' })
  @IsNumber()
  follower_count: number;
}
