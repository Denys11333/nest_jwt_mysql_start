import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RoleModule } from '../role/role.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { UserDevice } from 'src/user-device/entities/user-device.entity';
import { UserDeviceService } from 'src/user-device/user-device.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserDeviceService],
  imports: [
    TypeOrmModule.forFeature([User, UserDevice, Role]),
    RoleModule,
    forwardRef(() => AuthModule),
  ],
  exports: [UserService],
})
export class UserModule {}
