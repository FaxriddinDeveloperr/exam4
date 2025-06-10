import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';


@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    let roles = this.reflector.getAllAndOverride("role", ([
      context.getHandler(),
      context.getClass(),
    ]));
    if (!roles) {
      return true
    }
    let { user } = context.switchToHttp().getRequest();
    if(roles.some((role)=> role == user.role)){
      return true
    }
    throw new ForbiddenException
  }
}
