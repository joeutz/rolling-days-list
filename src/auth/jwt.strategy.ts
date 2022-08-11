import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserJwtPayload } from "src/common/dtos/user-jwt-payload.interface";
import { configService } from "src/config.service";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private usersService: UsersService,
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: UserJwtPayload): Promise<User | null> {
        const { username, userid } = payload;
        const user = await this.usersService.findOneByEmail(username);
        if (user && user.id === userid) {
            return user;
        }
        return null;
    }
}