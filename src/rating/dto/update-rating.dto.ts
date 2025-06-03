import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRatingDto } from './create-rating.dto';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateRatingDto {    
      @ApiProperty({ example: 5 })
      @IsNumber()
      @IsOptional()
      ball: number;
}
