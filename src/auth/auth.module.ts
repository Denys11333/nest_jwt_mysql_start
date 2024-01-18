import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSessionCookieService } from 'src/user-session-cookie/user-session-cookie.service';
import { UserSessionCookie } from 'src/user-session-cookie/entities/user-session-cookie.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserSessionCookieService],
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([UserSessionCookie]),
    JwtModule.register({}),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
