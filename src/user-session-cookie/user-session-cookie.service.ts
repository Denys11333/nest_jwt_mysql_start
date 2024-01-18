import { Injectable } from '@nestjs/common';
import { CreateUserSessionCookieDto } from './dto/create-user-session-cookie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSessionCookie } from './entities/user-session-cookie.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserSessionCookieService {
  constructor(
    @InjectRepository(UserSessionCookie)
    private userSessionCookieRepository: Repository<UserSessionCookie>,
  ) {}

  create(createUserDeviceDto: CreateUserSessionCookieDto) {
    return this.userSessionCookieRepository.save(createUserDeviceDto);
  }

  setRefreshToken(userSessionCookie: UserSessionCookie, refreshToken: string) {
    return this.userSessionCookieRepository.save({
      ...userSessionCookie,
      refreshToken,
    });
  }
}
