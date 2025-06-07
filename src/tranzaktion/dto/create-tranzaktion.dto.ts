import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator"

export enum Tolov_turi {
  Tolandi = "Karta orqaliy",
  kutilmoqda = 'Naqt tolov',
}
export class CreateTranzaktionDto {
  @ApiProperty({example: 250000})
  @IsNumber()
  @IsNotEmpty()
  summa: number

  @ApiProperty({example: "Karta orqaliy  ||  Naqt tolov"})
  @IsEnum(Tolov_turi)
  @IsNotEmpty()
  tolov_turi: number

  @ApiProperty({example: 1})
  @IsNumber()
  @IsNotEmpty()
  orderId: number
}
