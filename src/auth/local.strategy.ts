import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from 'src/common/dtos/auth-login-payload.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(authDto: AuthCredentialsDto): Promise<any> {
        const user = await this.authService.signin(authDto);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}