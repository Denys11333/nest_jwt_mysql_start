import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role-auth.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}
  configService = new ConfigService();

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
        message: 'Невірний формат access токену.',
      });
    }

    try {
      const user = this.jwtService.verify(token, {
        secret:
          this.configService.get<string>('ACCESS_TOKEN_SECRET') ||
          'SECRET__ACCESS',
      });
      req.user = user;

      return user.roles.some((role: string) => requiredRoles.includes(role));
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException({
          message: 'Термін дії access токену закінчився.',
        });
      }
      throw new UnauthorizedException({ message: 'Токен не валідний.' });
    }
  }
}
