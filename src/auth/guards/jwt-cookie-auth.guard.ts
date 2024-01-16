import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtCookieAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  configService = new ConfigService();

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const tokenFromCookie = req.cookies['refreshToken'];

    if (!tokenFromCookie) {
      throw new UnauthorizedException('Refresh токен відсутній.');
    }

    try {
      req.user = this.jwtService.verify(tokenFromCookie, {
        secret:
          this.configService.get<string>('REFRESH_TOKEN_SECRET') ||
          'SECRET__REFRESH',
      });
      return true;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException({
          message: 'Термін дії refresh токену закінчився.',
        });
      }
      throw new UnauthorizedException({
        message: 'Refresh токен не валідний.',
      });
    }
  }
}
