import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/role-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { UserRole } from '../auth/user-roles.enum';
import { User } from './entities/user.entity';

@ApiTags('User')
@Controller('v1/users')
export class UserController {
  constructor() {}

  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  @Get('currentUser')
  currentUser(@CurrentUser() user: User) {
    return user;
  }
}
