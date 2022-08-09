import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import exp from 'constants';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        }],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('can create user', () => {
    const spy = jest.spyOn(repo, 'save').mockImplementation();

    const firstName = 'first', lastName = 'last', emailAddress = 'first@last.com';
    const newUser = service.create(firstName, lastName, emailAddress);
    expect(newUser.firstName).toBe('first');
    expect(newUser.lastName).toBe('last');
    expect(newUser.emailAddress).toBe('first@last.com');
    expect(newUser.createDateTime).toBeTruthy();
    expect(newUser.lastChangedDateTime).toBeTruthy();
    expect(spy).toBeCalledTimes(1);
  });
});
