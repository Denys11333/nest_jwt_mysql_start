import { Module } from '@nestjs/common';
import { UserDeviceService } from './user-device.service';
import { UserDeviceController } from './user-device.controller';
import { UserDevice } from './entities/user-device.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [UserDeviceController],
  providers: [UserDeviceService],
  imports: [TypeOrmModule.forFeature([UserDevice])],
  exports: [UserDeviceService],
})
export class UserDeviceModule {}
