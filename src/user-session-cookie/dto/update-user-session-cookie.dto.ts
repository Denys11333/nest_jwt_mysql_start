import { PartialType } from '@nestjs/swagger';
import { CreateUserSessionCookieDto } from './create-user-session-cookie.dto';

export class UpdateUserSessionCookie extends PartialType(
  CreateUserSessionCookieDto,
) {}
