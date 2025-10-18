import { CoreEntity } from 'src/common/entity/core.entity';
import { Entity, Column, ManyToOne, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { User } from 'src/user/entity/user.entity';
import { Post } from 'src/post/entity/post.entity';
import * as bcrypt from 'bcryptjs';
import { InternalServerErrorException } from '@nestjs/common';

@InputType('CommentInputType', { isAbstract: true })
@ObjectType()
@Entity({ schema: 'private_blog' })
export class Comment extends CoreEntity {
  // @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'SET NULL',
    eager: true,
  })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'SET NULL',
    eager: true,
  })
  post: Post;

  @Column({ nullable: false })
  @Field(() => String)
  @IsString()
  comment: string;

  @Column({ nullable: false })
  @Field(() => String)
  @IsString()
  commentId: string;

  @Column({ nullable: false })
  @Field(() => String)
  @IsString()
  commentPassword: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.commentPassword) {
      try {
        this.commentPassword = await bcrypt.hash(this.commentPassword, 10);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(aPassword, this.commentPassword);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
