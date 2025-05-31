import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateChatDto } from './create-chat.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateChatDto  {
    @ApiProperty({example: "hello muflixa"})
        @IsString()
        @IsOptional()
        message: string
    
    
    
        @ApiProperty({example: 4})
        @IsNumber()
        @IsOptional()
        receiver_id: number
    
    
        @ApiProperty({example: 4})
        @IsNumber()
        @IsOptional()
        product_id: number
    
    
        @ApiProperty({example: 4})
        @IsNumber()
        @IsOptional()
        sender_id: number
    }
 
