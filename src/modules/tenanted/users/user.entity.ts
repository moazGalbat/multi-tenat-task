import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { AbstractEntity } from '../../../abstract.entity';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User extends AbstractEntity {
  @Column()
  @Field()
  name: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  @HideField()
  password: string;

  @Column()
  @Field()
  role: string;
}
