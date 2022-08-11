import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { configService } from '../config.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

const jwtFactory = {
  useFactory: async () => ({
    secret: configService.get('JWT_SECRET'),
    signOptions: {
      expiresIn: configService.get('JWT_EXP_H'),
    },
  }),
};

@Module({
  imports: [JwtModule.registerAsync(jwtFactory), UsersModule, PassportModule.register({ defaultStrategy: 'jwt' }),],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule { }
