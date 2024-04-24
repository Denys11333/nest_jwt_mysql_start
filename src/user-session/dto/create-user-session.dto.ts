import { User } from 'src/user/entities/user.entity';

export class CreateUserSessionDto {
  operationSystem: string;

  ipAddress: string;

  deletedAt: Date;

  user: User;
}
