import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ example: 'milliy cola' })
  @IsString()
  @IsOptional()
  name: string;
  @ApiProperty({ example: 'resm' })
  @IsString()
  @IsOptional()
  img: string;

  @ApiProperty({ example: 'eng zor mahsulot ' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @IsOptional()
  count: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  market_id: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  category_id: number;

  @ApiProperty({ example: 12 })
  @IsNumber()
  @IsOptional()
  price: number;
}
