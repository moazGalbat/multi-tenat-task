import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CONNECTION } from 'src/modules/tenancy/tenancy.symbols';
import { PasswordService } from '../auth/password.service';

@Injectable()
export class UserService {
  private readonly userRepository: Repository<User>;

  constructor(
    @Inject(CONNECTION) connection: DataSource,
    private passwordService: PasswordService,
  ) {
    this.userRepository = connection.getRepository(User);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await this.passwordService.hashPassword(
      createUserDto.password,
    );
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}
