import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
    @ApiProperty({example:1})
    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    userId: number

    @ApiProperty({example:2})
    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    productId: number


    @ApiProperty({example: 'hello '})
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    message: string


    @ApiProperty({example: 1})
    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    star: number
}
   