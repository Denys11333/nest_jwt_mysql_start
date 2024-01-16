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
export class JwtHeaderAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  configService = new ConfigService();

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const headers: { authorization: string } = req.headers;
    const authHeader = headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Заголовок Authorization відсутній');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException({
        message: 'Невірний формат access токену',
      });
    }

    try {
      req.user = this.jwtService.verify(token, {
        secret:
          this.configService.get<string>('ACCESS_TOKEN_SECRET') ||
          'SECRET__ACCESS',
      });
      return true;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException({
          message: 'Термін дії access токену закінчився',
        });
      }
      throw new UnauthorizedException({ message: 'Access токен не валідний' });
    }
  }
}
