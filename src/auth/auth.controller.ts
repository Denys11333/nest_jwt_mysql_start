import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserCredentialDto } from '../user/dto/user-credential.dto';

@ApiTags('Authorization')
@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({})
  @ApiResponse({})
  @Post('login')
  login(@Body() userCredentialDto: UserCredentialDto) {
    return this.authService.login(userCredentialDto);
  }

  @ApiOperation({})
  @ApiResponse({})
  @Post('registration')
  registration(@Body() userCredentialDto: UserCredentialDto) {
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
