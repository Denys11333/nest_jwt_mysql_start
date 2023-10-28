import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './role-auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const headers: { authorization: string } = req.headers;
    const authHeader = headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Заголовок Authorization відсутній.');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException({
        message: 'Невірний формат токену.',
      });
    }

    try {
      const user = this.jwtService.verify(token);
      req.user = user;

      return user.roles.some((role: string) => requiredRoles.includes(role));
    } catch (e) {
      throw new HttpException('Токен не валідний.', HttpStatus.FORBIDDEN);
    }
  }
}
