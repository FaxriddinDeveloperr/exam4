import { PartialType } from '@nestjs/swagger';
import { CreateSavatDto } from './create-savat.dto';

export class UpdateSavatDto extends PartialType(CreateSavatDto) {}
