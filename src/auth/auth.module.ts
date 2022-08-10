import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { configService } from '../config.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

const jwtFactory = {
  useFactory: async () => ({
    secret: configService.get('JWT_SECRET'),
    signOptions: {
      expiresIn: configService.get('JWT_EXP_H'),
    },
  }),
};

@Module({
  imports: [JwtModule.registerAsync(jwtFactory), UsersModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
