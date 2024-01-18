import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RoleModule } from '../role/role.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { UserSessionCookieService } from 'src/user-session-cookie/user-session-cookie.service';
import { UserSessionCookie } from 'src/user-session-cookie/entities/user-session-cookie.entity';

@Module({
  controllers: [UserController],
  providers: [UserService, UserSessionCookieService],
  imports: [
    TypeOrmModule.forFeature([User, UserSessionCookie, Role]),
    RoleModule,
    forwardRef(() => AuthModule),
  ],
  exports: [UserService],
})
export class UserModule {}
