import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user-sessions')
@Controller('user-session')
export class UserSessionController {
  constructor() {}
}
