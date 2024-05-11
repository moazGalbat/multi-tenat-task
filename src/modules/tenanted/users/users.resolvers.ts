// user.resolver.ts

import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UserService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUserDto') createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.userService.findAllUsers();
  }
}
