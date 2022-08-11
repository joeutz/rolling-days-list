import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const mockUser = new User('first', 'last', 'first@last.com');
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService, UsersService, {
        provide: getRepositoryToken(User),
        useValue: {
          create: jest
            .fn()
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .mockImplementation((firstName: string, lastName: string, emailAddress: string) => Promise.resolve(mockUser)),
        },
      },],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
