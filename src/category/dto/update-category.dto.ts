import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Electronics' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  icon: string;
}
