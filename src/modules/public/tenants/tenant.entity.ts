import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractEntity } from '../../../abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'tenants' })
@ObjectType()
export class Tenant extends AbstractEntity {
  @Column()
  @Field()
  name: string;
}
