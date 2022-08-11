import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { configService } from './config.service';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TasksModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    UsersModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
