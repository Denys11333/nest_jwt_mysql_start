import { Test, TestingModule } from '@nestjs/testing';
import { UserDeviceService } from './user-device.service';

describe('UserDeviceService', () => {
  let service: UserDeviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserDeviceService],
    }).compile();

    service = module.get<UserDeviceService>(UserDeviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
