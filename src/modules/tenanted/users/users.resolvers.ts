// user.resolver.ts

import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UserService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Authorize } from '../auth/guards/authorize.guard';
import { Role } from '../auth/role.enum';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Authorize(Role.ADMIN)
  @Mutation(() => User)
  async createUser(
    @Args('createUserDto') createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Authorize(Role.ADMIN)
  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.userService.findAllUsers();
  }
}
