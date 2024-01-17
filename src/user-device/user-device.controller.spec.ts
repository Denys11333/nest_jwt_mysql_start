import { Test, TestingModule } from '@nestjs/testing';
import { UserDeviceController } from './user-device.controller';
import { UserDeviceService } from './user-device.service';

describe('UserDeviceController', () => {
  let controller: UserDeviceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserDeviceController],
      providers: [UserDeviceService],
    }).compile();

    controller = module.get<UserDeviceController>(UserDeviceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
