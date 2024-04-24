import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSessionService } from 'src/user-session/user-session.service';
import { UserSession } from 'src/user-session/entities/user-session-cookie.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserSessionService],
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([UserSession]),
    JwtModule.register({}),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
