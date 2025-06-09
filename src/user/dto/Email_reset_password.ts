import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EmailPassword {
  @ApiProperty({
    example:
      "Bu routga hechnarsa jo'natmayn bu roout passwort almashtirish uchun  avtomatik ishlaydi",
  })
  @IsOptional()
  message: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
