import { Field, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class CoreEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Field(() => Date, { nullable: true })
  updatedAt: Date;
}
