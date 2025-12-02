import { CoreEntity } from '../../common/entity/core.entity';
import { Entity, Column, ManyToOne, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Post } from '../../post/entity/post.entity';
import * as bcrypt from 'bcryptjs';
import { InternalServerErrorException } from '@nestjs/common';

@InputType('CommentInputType', { isAbstract: true })
@ObjectType()
@Entity({ schema: 'private_blog' })
export class Comment extends CoreEntity {
  //추후 유저인증시 추가
  // @Field(() => User)
  // @ManyToOne(() => User, (user) => user.comments, {
  //   onDelete: 'SET NULL',
  //   eager: true,
  // })
  // user: User;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'SET NULL',
    eager: true,
  })
  @Field(() => Post, { nullable: true })
  post: Post;

  @Column({ nullable: false })
  @Field(() => String)
  @IsString()
  comment: string;

  @Column({ nullable: true })
  @Field(() => String)
  @IsString()
  annonymousId: string;

  @Column({ nullable: true })
  @Field(() => String)
  @IsString()
  annonymousPassword: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.annonymousPassword) {
      try {
        this.annonymousPassword = await bcrypt.hash(
          this.annonymousPassword,
          10,
        );
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(aPassword, this.annonymousPassword);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
