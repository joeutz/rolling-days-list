import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialsDto } from 'src/common/dtos/auth-login-payload.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/signin')
    signin(
        @Body() authDto: AuthCredentialsDto,
    ): Promise<{ accessMessage: string }> {
        return this.authService.signin(authDto);
    }

    @Post('/signup')
    signup(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.authService.signup(createUserDto);
    }
}