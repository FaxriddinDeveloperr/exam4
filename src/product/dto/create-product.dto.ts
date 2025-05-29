import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'milliy cola' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'resm' })
  @IsString()
  @IsNotEmpty()
  img: string;

  @ApiProperty({ example: 'eng zor mahsulot ' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @IsNotEmpty()
  count: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  market_id: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  category_id: number;

  @ApiProperty({ example: 12 })
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
