import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }
  create(firstName: string, lastName: string, emailAddress: string): User {
    const newUser = new User(firstName, lastName, emailAddress);
    this.userRepository.save(newUser);
    return newUser;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOneByEmail(email: string) {
    const foundUser = this.userRepository.findOneBy({
      emailAddress: email,
    });
    return foundUser
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
