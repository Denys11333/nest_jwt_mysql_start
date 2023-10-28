import { forwardRef, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.model';
import { User } from '../user/user.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [RoleService],
  controllers: [RoleController],
  imports: [
    TypeOrmModule.forFeature([Role, User]),
    forwardRef(() => AuthModule),
  ],
  exports: [RoleService],
})
export class RoleModule {}
