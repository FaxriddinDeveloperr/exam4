import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EmailPassword {
  @ApiProperty({
    example:
      "Bu routga hechnarsa jo'natmayn bu roout passwort almashtirish uchun  avtomatik ishlaydi",
  })
  message: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
