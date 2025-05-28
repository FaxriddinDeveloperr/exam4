import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/user/dto/register-user.dto';

export const Roles = (...role: Role[]) => SetMetadata('role', role);
