import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"

export enum Status {
    PENDING = "pending",
    ACTIV = "activ",
    FINISH = "finish"
}
export class CreateOrderDto {
    
    @ApiProperty({example: "Toshkent"})
    @IsNotEmpty()
    @IsString()
    addres: string
}

export class StatusDto{
    @ApiProperty({example: "status code"})
    @IsEnum(Status)
    status: Status.ACTIV | Status.FINISH | Status.PENDING
}
