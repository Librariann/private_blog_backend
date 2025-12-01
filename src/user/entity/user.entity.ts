import { CoreEntity } from '../../common/entity/core.entity';
import * as bcrypt from 'bcryptjs';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { InternalServerErrorException } from '@nestjs/common';
import { Post } from '../../post/entity/post.entity';

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity({ schema: 'private_blog' })
export class User extends CoreEntity {
  @Column({ unique: true, nullable: false })
  @Field(() => String)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  password: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  profileImage?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  nickname: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  introduce?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  location?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  website?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  role?: string;

  @Field(() => [Post])
  @OneToMany(() => Post, (post) => post.user)
  posts?: Post[];

  // @Field(() => [Comment])
  // @OneToMany(() => Comment, (comment) => comment.user)
  // comments?: Comment[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(aPassword, this.password);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
