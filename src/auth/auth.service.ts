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
import { Response } from 'express';
import { Request } from 'express';
import { PayloadUserDto } from 'src/user/dto/payload-user.dto';
import { ConfigService } from '@nestjs/config';
import { UAParser } from 'ua-parser-js';
import { UserSessionCookieService } from 'src/user-session-cookie/user-session-cookie.service';
import { CreateUserSessionCookieDto } from 'src/user-session-cookie/dto/create-user-session-cookie.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private userSessionCookieService: UserSessionCookieService,
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

    const userSessionCookieDto = this.createUserSessionCookie(
      userAgent,
      ipAddress,
      tokens.refreshToken,
    );

    const userSessionCookie = await this.userService.addUserDeviceIfNotExist({
      ...userSessionCookieDto,
      user,
    });

    await this.userSessionCookieService.setRefreshToken(
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
      { roles: true, userSessionsCookie: true },
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
    const oldRefreshToken = request.cookies['refreshToken'];

    if (!currentUser) {
      throw new UnauthorizedException('Refresh токен не валідний');
    }

    const userSessionCookie = currentUser.userSessionsCookie.find(
      (device) => device.refreshToken === oldRefreshToken,
    );

    if (!userSessionCookie) {
      throw new UnauthorizedException(
        `Refresh токен не дійсний для теперішнього користувача`,
      );
    }

    const tokens = await this.generateTokens(currentUser);

    await this.userSessionCookieService.setRefreshToken(
      {
        ...userSessionCookie,
        deletedAt: this.getExpirationDateFromToken(tokens.refreshToken),
      },
      tokens.refreshToken,
    );

    this.setCookie(response, 'refreshToken', tokens.refreshToken);

    return { accessToken: tokens.accessToken };
  }

  createUserSessionCookie(
    userAgent: string,
    ipAddress: string,
    refreshToken: string,
  ) {
    const OSInfo = UAParser(userAgent).os;

    return {
      operationSystem: `${OSInfo.name}-${OSInfo.version}`,
      ipAddress: ipAddress,
      deletedAt: this.getExpirationDateFromToken(refreshToken),
    } as CreateUserSessionCookieDto;
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
    response.cookie(cookieName, cookieValue, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }
}
