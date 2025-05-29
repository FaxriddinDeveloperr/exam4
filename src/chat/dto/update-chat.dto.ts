import { ApiProperty } from '@nestjs/swagger';
import {  IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateChatDto {
    @ApiProperty({example: "hello human"})
       @IsString()
       @IsOptional()
       
       message: string
   
       @ApiProperty({example: 7})
       @IsNumber()
       @IsOptional()
       receiver_id: number
   
       @ApiProperty({example:9})
       @IsNumber()
       @IsOptional()
       product_id: number
   
       @ApiProperty({example:1})
       @IsNumber()
       @IsOptional()
       sender_id: number
   
}