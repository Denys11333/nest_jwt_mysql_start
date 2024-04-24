import { PartialType } from '@nestjs/swagger';
import { CreateUserSessionDto } from './create-user-session.dto';

export class UpdateUserSession extends PartialType(CreateUserSessionDto) {}
