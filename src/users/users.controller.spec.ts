import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  const mockUser = new User('first', 'last', 'first@last.com');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest
              .fn()
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              .mockImplementation((firstName: string, lastName: string, emailAddress: string) => Promise.resolve(mockUser)),
          },
        },],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should be able to process create user dto', () => {
    const spy = jest.spyOn(service, 'create').mockReturnValue(new User('first', 'last', 'first@last.test'));
    const createUser = { firstName: 'first', lastName: 'last', emailAddress: 'first@last.test' };
    const newUser = controller.create(createUser);
    expect(newUser.firstName).toBe('first');
    expect(spy).toBeCalledTimes(1);
  })
});
