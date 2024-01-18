import { User } from 'src/user/entities/user.entity';

export class CreateUserSessionCookieDto {
  operationSystem: string;

  ipAddress: string;

  deletedAt: Date;

  user: User;
}
