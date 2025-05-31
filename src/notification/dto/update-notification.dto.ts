import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateNotificationDto } from './create-notification.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateNotificationDto {
        @ApiProperty({example: 2})
        @IsNotEmpty()
        Is_read: boolean
}
