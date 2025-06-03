import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSavatDto {
  
  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @IsNotEmpty()
  count: number;
}
