import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserSessionCookieDto } from './dto/create-user-session-cookie.dto';
import { UserSessionCookieService } from './user-session-cookie.service';

@Controller('user-session-cookie')
export class UserSessionCookieController {
  constructor(
    private readonly userSessionCookieService: UserSessionCookieService,
  ) {}

  @Post()
  create(@Body() createUserDeviceDto: CreateUserSessionCookieDto) {
    return this.userSessionCookieService.create(createUserDeviceDto);
  }
}
