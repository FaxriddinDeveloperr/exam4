import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSupportTicketDto } from './create-support_ticket.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSupportTicketDto extends PartialType(CreateSupportTicketDto) {
    @ApiProperty({ example: 1 })
    @IsOptional()
    @IsNumber()
    userId: number

    @ApiProperty({ example: 'Matesha' })
    @IsOptional()
    @IsString()
    subjectName: string

    @ApiProperty({ example: 'yomon yoqmadi' })
    @IsOptional()
    @IsString()
    message: string

    @ApiProperty({ example: 'yomon' })
    @IsOptional()
    @IsString()
    status: string
}
