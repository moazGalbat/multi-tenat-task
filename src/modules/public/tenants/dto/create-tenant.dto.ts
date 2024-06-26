import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateTenantDto {
  @Field()
  @IsNotEmpty()
  name: string;
}
