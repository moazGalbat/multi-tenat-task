import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from '../../auth/role.enum';

@InputType()
export class CreateUserDto {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;

  @Field()
  @IsEnum(Role)
  role: string;
}
