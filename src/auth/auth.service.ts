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

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  configService = new ConfigService();

  async login(response: Response, userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    const tokens = await this.generateTokens(user);

    await this.userService.setRefreshToken(user.id, tokens.refreshToken);

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return tokens;
  }

  async registration(userCredential: CreateUserDto) {
    const candidate = await this.userService.findUserForAuth(
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
    const user = await this.userService.findUserForAuth(
      userCredential.username,
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

    const refreshTokenPayLoad = {
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
      this.jwtService.signAsync(refreshTokenPayLoad, {
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
    currentUser: PayloadUserDto,
  ) {
    const oldRefreshToken = request.cookies['refreshToken'];

    if (!currentUser) {
      throw new UnauthorizedException('Incorect refresh token.');
    }

    const user = await this.userService.findUserForAuth(currentUser.username);

    if (user.refreshToken !== oldRefreshToken) {
      throw new UnauthorizedException(
        'Refresh токен не дійсний для теперішнього користувача',
      );
    }

    const tokens = await this.generateTokens(user);

    await this.userService.setRefreshToken(user.id, tokens.refreshToken);

    await response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { accessToken: tokens.accessToken };
  }
}
