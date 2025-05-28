import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRatingDto } from './create-rating.dto';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateRatingDto extends PartialType(CreateRatingDto) {    
      @ApiProperty({ example: 100 })
      @IsNumber()
      @IsNotEmpty()
      ball: number;
}
