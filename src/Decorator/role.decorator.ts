<<<<<<< HEAD
import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/user/dto/register-user.dto';

export const Roles = (...role: Role[]) => SetMetadata('role', role);
=======
import { SetMetadata } from "@nestjs/common"
import { Role } from "src/user/dto/register-user.dto";


export const Roles = (...role: Role[]) => SetMetadata("role", role);
>>>>>>> 2100402c22aa3414ed78ba14a88f559b2176acb9
