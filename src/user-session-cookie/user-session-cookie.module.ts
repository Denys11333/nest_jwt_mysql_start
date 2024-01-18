import { Module } from '@nestjs/common';
import { UserSessionCookie } from './entities/user-session-cookie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSessionCookieController } from './user-session-cookie.controller';
import { UserSessionCookieService } from './user-session-cookie.service';

@Module({
  controllers: [UserSessionCookieController],
  providers: [UserSessionCookieService],
  imports: [TypeOrmModule.forFeature([UserSessionCookie])],
  exports: [UserSessionCookieService],
})
export class UserSessionCookieModule {}
