import { CoreEntity } from 'src/common/entity/core.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { User } from 'src/user/entity/user.entity';

@InputType('CommentInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Comment extends CoreEntity {
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'SET NULL',
    eager: true,
  })
  user: User;

  @Column({ nullable: false })
  @Field(() => String)
  @IsString()
  comment: string;
}
