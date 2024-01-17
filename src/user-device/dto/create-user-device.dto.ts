import { User } from 'src/user/entities/user.entity';

export class CreateUserDeviceDto {
  operationSystem: string;

  ipAddress: string;

  user: User;
}
