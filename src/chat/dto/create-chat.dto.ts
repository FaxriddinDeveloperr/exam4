import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateChatDto {
    @ApiProperty({example: "hello human"})
    @IsString()
    @IsNotEmpty()
    
    message: string

    @ApiProperty({example: 7})
    @IsNumber()
    @IsNotEmpty()
    receiver_id: number

    @ApiProperty({example:9})
    @IsNumber()
    @IsNotEmpty()
    product_id: number

    @ApiProperty({example:1})
    @IsNumber()
    @IsNotEmpty()
    sender_id: number
}
