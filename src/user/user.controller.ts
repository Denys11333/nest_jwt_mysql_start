import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from '../auth/decorators/role-auth.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { UserRole } from '../auth/user-roles.enum';
import { CurrentUserInterceptor } from 'src/auth/interceptors/current-user.interceptor';
import { User } from './entities/user.entity';
import { UserRelations } from 'src/auth/decorators/user-relations.decorator';
import { plainToInstance } from 'class-transformer';
import { UserDto } from './dto/user.dto';

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
    return plainToInstance(UserDto, user);
  }
}
