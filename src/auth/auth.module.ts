import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { UserDeviceService } from 'src/user-device/user-device.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDevice } from 'src/user-device/entities/user-device.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserDeviceService],
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([UserDevice]),
    JwtModule.register({}),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
