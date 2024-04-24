import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RoleModule } from '../role/role.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { UserSessionService } from 'src/user-session/user-session.service';
import { UserSession } from 'src/user-session/entities/user-session-cookie.entity';

@Module({
  controllers: [UserController],
  providers: [UserService, UserSessionService],
  imports: [
    TypeOrmModule.forFeature([User, UserSession, Role]),
    RoleModule,
    forwardRef(() => AuthModule),
  ],
  exports: [UserService],
})
export class UserModule {}
