import { Inject, Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CONNECTION } from 'src/modules/tenancy/tenancy.symbols';

@Injectable()
export class UserService {
  private readonly userRepository: Repository<User>;

  constructor(@Inject(CONNECTION) connection: Connection) {
    this.userRepository = connection.getRepository(User);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}
