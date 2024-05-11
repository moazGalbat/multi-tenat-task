import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractEntity } from 'src/abstract.entity';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User extends AbstractEntity {
  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;
}
