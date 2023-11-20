import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';

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
  login(@Body() userCredentialDto: CreateUserDto) {
    return this.authService.login(userCredentialDto);
  }

  @ApiOperation({})
  @ApiCreatedResponse({
    description: 'Create user in system',
    schema: {
      example: 'Заявка на реєстрацію відправлена.',
    },
  })
  @Post('registration')
  registration(@Body() userCredentialDto: CreateUserDto) {
    return this.authService.registration(userCredentialDto);
  }

  @ApiOperation({})
  @ApiResponse({})
  @Get('isJwtValid')
  @UseGuards(JwtAuthGuard)
  async isJwtValid() {
    return { message: 'Токен валідний' };
  }
}
