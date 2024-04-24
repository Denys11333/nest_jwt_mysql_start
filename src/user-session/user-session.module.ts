import { Module } from '@nestjs/common';
import { UserSession } from './entities/user-session-cookie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSessionController } from './user-session.controller';
import { UserSessionService } from './user-session.service';

@Module({
  controllers: [UserSessionController],
  providers: [UserSessionService],
  imports: [TypeOrmModule.forFeature([UserSession])],
  exports: [UserSessionService],
})
export class UserSessionModule {}
