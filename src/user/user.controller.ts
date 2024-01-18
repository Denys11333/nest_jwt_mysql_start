import {
  Controller,
  Get,
  Headers,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/role-auth.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { UserRole } from '../auth/user-roles.enum';
import { UAParser } from 'ua-parser-js';
import { CurrentUserInterceptor } from 'src/auth/interceptors/current-user.interceptor';
import { User } from './entities/user.entity';
import { UserRelations } from 'src/auth/decorators/relations-user.decorator';

@ApiTags('Users')
@Controller('v1/users')
export class UserController {
  constructor() {}

  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  @UseInterceptors(CurrentUserInterceptor)
  @UserRelations({ roles: true })
  @Get('current-user')
  currentUser(@CurrentUser() user: User) {
    return user;
  }

  @Get('user-agent')
  getUserAgent(@Headers('user-agent') userAgent: string) {
    return UAParser(userAgent);
  }
}
