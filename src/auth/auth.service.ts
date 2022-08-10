import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from 'src/common/dtos/auth-login-payload.interface';
import { UserJwtPayload } from 'src/common/dtos/user-jwt-payload.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    signup(createUserDto: CreateUserDto): Promise<import("../users/entities/user.entity").User> {
        throw new Error('Method not implemented.');
    }
    constructor(private jwtService: JwtService, private usersService: UsersService) { }

    async signin(
        authDto: AuthCredentialsDto,
    ): Promise<{ accessMessage: string }> {
        console.log(authDto);
        const user = await this.usersService.findOneByEmail(authDto.username);
        console.log(user);
        if (user) {
            const userid = user.id;
            const username = authDto.username
            const payload: UserJwtPayload = { username, userid };
            const accessMessage: string = await this.jwtService.sign(payload);
            return { accessMessage };
        } else {
            throw new UnauthorizedException('Incorrect login credentials!');
        }
    }
}