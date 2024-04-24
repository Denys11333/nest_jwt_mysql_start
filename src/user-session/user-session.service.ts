import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSession } from './entities/user-session-cookie.entity';
import { CreateUserSessionDto } from './dto/create-user-session.dto';

@Injectable()
export class UserSessionService {
  constructor(
    @InjectRepository(UserSession)
    private userSessionCookieRepository: Repository<UserSession>,
  ) {}

  createSession(createUserSessioDto: CreateUserSessionDto) {
    return this.userSessionCookieRepository.save(createUserSessioDto);
  }

  setRefreshToken(userSessionCookie: UserSession, refreshToken: string) {
    return this.userSessionCookieRepository.save({
      ...userSessionCookie,
      refreshToken,
    });
  }
}
