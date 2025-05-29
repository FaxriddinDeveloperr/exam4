import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"


export enum Status {
    PENDING = "pending",
    ACTIV = "activ",
    FINISH = "finish"
}
export class CreateOrderDto {
    @ApiProperty({example: 1})
    @IsNotEmpty()
    @IsNumber()
    userId: number

    @ApiProperty({example: "Toshkent"})
    @IsNotEmpty()
    @IsString()
    addres: string
}
