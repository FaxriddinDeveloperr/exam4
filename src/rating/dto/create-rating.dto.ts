import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  sellerId: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  ball: number;
}
