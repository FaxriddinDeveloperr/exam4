import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSupportTicketDto {

    @ApiProperty({ example: 'Product haqida' })
    @IsString()
    @IsOptional()
    subjectName: string

    @ApiProperty({ example: 'Menga judaham yoqdi!' })
    @IsString()
    @IsOptional()
    message: string
}
