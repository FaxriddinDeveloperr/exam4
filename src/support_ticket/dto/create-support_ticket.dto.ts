import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSupportTicketDto {

    @ApiProperty({ example: 'Matematika' })
    @IsString()
    @IsOptional()
    subjectName: string

    @ApiProperty({ example: 'Menga jusaham yoqdi!!!' })
    @IsString()
    @IsOptional()
    message: string
}
