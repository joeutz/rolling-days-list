import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from 'src/common/dtos/auth-login-payload.interface';
import { UserJwtPayload } from 'src/common/dtos/user-jwt-payload.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    signup(createUserDto: CreateUserDto): Promise<User> {
        throw new Error('Method not implemented.');
    }
    constructor(private jwtService: JwtService, private usersService: UsersService) { }

    async signin(
        authDto: AuthCredentialsDto,
    ): Promise<{ access_token: string }> {
        const user = await this.usersService.findOneByEmail(authDto.username);
        if (user) {
            const userid = user.id;
            const username = authDto.username
            const payload: UserJwtPayload = { username, userid };
            const access_token: string = await this.jwtService.sign(payload);
            return { access_token };
        } else {
            throw new UnauthorizedException('Incorrect login credentials!');
        }
    }
}