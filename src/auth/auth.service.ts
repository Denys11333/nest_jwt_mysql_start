import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { Response, Request } from 'express';
import { PayloadUserDto } from 'src/user/dto/payload-user.dto';
import { ConfigService } from '@nestjs/config';
import { UAParser } from 'ua-parser-js';
import { UserSessionService } from 'src/user-session/user-session.service';
import { CreateUserSessionDto } from 'src/user-session/dto/create-user-session.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private userSessionService: UserSessionService,
  ) {}

  configService = new ConfigService();

  async login(
    response: Response,
    userDto: CreateUserDto,
    userAgent: string,
    ipAddress: string,
  ) {
    const user = await this.validateUser(userDto);

    const tokens = await this.generateTokens(user);

    const userSessionCookieDto = this.createUserSessionDto(
      userAgent,
      ipAddress,
      tokens.refreshToken,
    );

    const userSessionCookie = await this.userSessionService.createSession({
      ...userSessionCookieDto,
      user,
    });

    await this.userSessionService.setRefreshToken(
      userSessionCookie,
      tokens.refreshToken,
    );

    this.setCookie(response, 'refreshToken', tokens.refreshToken);

    return { accessToken: tokens.accessToken };
  }

  async registration(userCredential: CreateUserDto) {
    const candidate = await this.userService.findUserByUsername(
      userCredential.username,
    );

    if (candidate) {
      throw new HttpException(
        "Користувач з таким користувацьким ім'ям вже існує",
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(userCredential.password, 5);

    await this.userService.createUser({
      ...userCredential,
      password: hashPassword,
    });

    return 'Користувач зареєстрованний';
  }

  private async validateUser(userCredential: CreateUserDto) {
    const user = await this.userService.findUserByUsername(
      userCredential.username,
      { roles: true },
    );

    if (!user) {
      throw new UnauthorizedException({
        message: 'Неправильний логін або пароль',
      });
    }

    const passwordEquals = await bcrypt.compare(
      userCredential.password,
      user.password,
    );

    if (!passwordEquals) {
      throw new UnauthorizedException({
        message: 'Неправильний логін або пароль',
      });
    }

    return user;
  }

  private async generateTokens(user: User) {
    const accessTokenPayload: PayloadUserDto = {
      id: user.id,
      username: user.username,
      roles: user.roles.map((role) => role.roleName),
    };

    const refreshTokenPayload = {
      username: user.username,
      tokenId: uuidv4(),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload, {
        secret:
          this.configService.get<string>('ACCESS_TOKEN_SECRET') ||
          'SECRET__ACCESS',
        expiresIn:
          this.configService.get<string>('ACCESS_TOKEN_EXPIRATION') || '15m',
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        secret:
          this.configService.get<string>('REFRESH_TOKEN_SECRET') ||
          'SECRET__REFRESH',
        expiresIn:
          this.configService.get<string>('REFRESH_TOKEN_EXPIRATION') || '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(
    response: Response,
    request: Request,
    currentUser: User,
  ) {
    const currentRefreshToken = request.cookies['refreshToken'];

    if (!currentUser) {
      throw new UnauthorizedException('Refresh токен не валідний');
    }

    const userSession = currentUser.userSessions.find(
      (userSession) => userSession.refreshToken === currentRefreshToken,
    );

    if (!userSession) {
      throw new UnauthorizedException(`Існуюча сесія не знайдена`);
    }

    const tokens = await this.generateTokens(currentUser);

    await this.userSessionService.setRefreshToken(
      {
        ...userSession,
        deletedAt: this.getExpirationDateFromToken(tokens.refreshToken),
      },
      tokens.refreshToken,
    );

    this.setCookie(response, 'refreshToken', tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  createUserSessionDto(
    userAgent: string,
    ipAddress: string,
    refreshToken: string,
  ) {
    const OSInfo = UAParser(userAgent).os;

    return {
      operationSystem: `${OSInfo.name}-${OSInfo.version}`,
      ipAddress: ipAddress,
      deletedAt: this.getExpirationDateFromToken(refreshToken),
    } as CreateUserSessionDto;
  }

  getExpirationDateFromToken(token) {
    const deletedAt = this.jwtService.decode(token)['exp'];

    const date = new Date(deletedAt * 1000);
    const formattedDate = date.toLocaleString('en-US', {
      timeZone: 'Europe/Kiev',
    });

    return new Date(formattedDate);
  }

  setCookie(response: Response, cookieName: string, cookieValue: string) {
    const date = new Date();
    date.setDate(date.getDate() + 30);

    response.cookie(cookieName, cookieValue, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      expires: date,
    });
  }
}
