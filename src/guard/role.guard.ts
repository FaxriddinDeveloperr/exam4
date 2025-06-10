import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/user/dto/register-user.dto';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    let roles = this.reflector.getAllAndOverride('role', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }
    let { user } = context.switchToHttp().getRequest();
    if (roles.some((role:Role) => role == user.role)) {
      return true;
    }
    throw new ForbiddenException();
  }
}
