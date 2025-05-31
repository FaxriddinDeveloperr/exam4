import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateNotificationDto {
    @ApiProperty({example: 2})
    @IsNotEmpty()
    userId: number

    @ApiProperty({example: "comment"})
    @IsOptional()
    type: string

    @ApiProperty({example: "message"})
    @IsString()
    @IsNotEmpty()
    message: string

}
