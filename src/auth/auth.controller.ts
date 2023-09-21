import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {CreateUserDto} from "../user/dto/create-user-dto";
import {AuthService} from "./auth.service";
import {JwtAuthGuard} from "./jwt-auth.guard";
import { CurrentUser } from "./current-user.decorator";
import { User } from "../user/user.model";
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("Authorization")
@Controller('v1/auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @ApiOperation({})
    @ApiResponse({})
    @Post('login')
    login(@Body() userDto: CreateUserDto) {
        return this.authService.login(userDto);
    }

    @ApiOperation({})
    @ApiResponse({})
    @Post('registration')
    registration(@Body() userDto: CreateUserDto) {
        return this.authService.registration(userDto);
    }

    @ApiOperation({})
    @ApiResponse({})
    @Get('isJwtValid')
    @UseGuards(JwtAuthGuard)
    async isJwtValid(@CurrentUser() user:User) {
        return {status : true, username: user.username}
    }
}   
