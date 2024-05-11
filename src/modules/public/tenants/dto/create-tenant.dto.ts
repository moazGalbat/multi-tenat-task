import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTenantDto {
  @Field()
  name: string;
}
