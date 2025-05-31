import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateChatDto {
    @ApiProperty({example: "hello muflixa"})
    @IsString()
    @IsNotEmpty()
    message: string



    @ApiProperty({example: 4})
    @IsNumber()
    @IsNotEmpty()
    receiver_id: number


    @ApiProperty({example: 4})
    @IsNumber()
    @IsNotEmpty()
    product_id: number


    @ApiProperty({example: 4})
    @IsNumber()
    @IsNotEmpty()
    sender_id: number
}
