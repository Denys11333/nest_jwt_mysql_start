import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Headers,
  Ip,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtHeaderAuthGuard } from './guards/jwt-header-auth.guard';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Response } from 'express';
import { Request } from 'express';
import { JwtCookieAuthGuard } from './guards/jwt-cookie-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { UserRelations } from './decorators/relations-user.decorator';

@ApiTags('Authorization')
@Controller('v1/authorization')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({})
  @ApiResponse({
    description: 'Return JWT token',
    schema: {
      properties: {
        token: {
          type: 'string',
          example:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        },
      },
    },
  })
  @Post('login')
  login(
    @Res({ passthrough: true }) response: Response,
    @Body() userCredentialDto: CreateUserDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ipAddress: string,
  ) {
    return this.authService.login(
      response,
      userCredentialDto,
      userAgent,
      ipAddress,
    );
  }

  @ApiOperation({})
  @ApiCreatedResponse({
    description: 'Create user in system',
    schema: {
      example: 'Заявка на реєстрацію відправлена.',
    },
  })
  @Post('registration')
  registration(
    @Body() userCredentialDto: CreateUserDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ipAddress: string,
  ) {
    return this.authService.registration(
      userCredentialDto,
      userAgent,
      ipAddress,
    );
  }

  @ApiOperation({})
  @ApiResponse({})
  @UseGuards(JwtCookieAuthGuard)
  @UseInterceptors(CurrentUserInterceptor)
  @UserRelations({ roles: true, userDevices: true })
  @Get('refresh')
  async refreshAccessToken(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
    @CurrentUser() user: User,
    @Headers('user-agent') userAgent: string,
    @Ip() ipAddress: string,
  ) {
    return await this.authService.refreshAccessToken(
      response,
      request,
      user,
      userAgent,
      ipAddress,
    );
  }

  @ApiOperation({})
  @ApiResponse({})
  @UseGuards(JwtHeaderAuthGuard)
  @Get('is-jwt-valid')
  async isJwtValid() {
    return { message: 'Токен валідний' };
  }
}
