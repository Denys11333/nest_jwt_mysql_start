import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/role-auth.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { UserRole } from '../auth/user-roles.enum';
import { PayloadUserDto } from './dto/payload-user.dto';
import { UAParser } from 'ua-parser-js';

@ApiTags('Users')
@Controller('v1/users')
export class UserController {
  constructor() {}

  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  @Get('current-user')
  currentUser(@CurrentUser() user: PayloadUserDto) {
    return user;
  }

  @Get('user-agent')
  getUserAgent(@Headers('user-agent') userAgent: string) {
    return UAParser(userAgent);
  }
}
