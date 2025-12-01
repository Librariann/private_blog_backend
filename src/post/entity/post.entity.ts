import { CoreEntity } from '../../common/entity/core.entity';
import { Entity, Column, ManyToOne, OneToMany, RelationId } from 'typeorm';
import {
  Field,
  ObjectType,
  InputType,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { IsInt, IsNumber, IsString } from 'class-validator';
import { Comment } from '../../comment/entity/comment.entity';
import { User } from '../../user/entity/user.entity';
import { Category } from '../../category/entity/category.entity';
import { Hashtag } from '../../hashtag/entity/hashtag.entity';

export enum PostStatus {
  DRAFT = 'DRAFT', // 임시저장
  PUBLISHED = 'PUBLISHED', // 공개
  PRIVATE = 'PRIVATE', // 비공개
  DELETED = 'DELETED', // 삭제
}
registerEnumType(PostStatus, { name: 'PostStatus' });
@InputType('PostInputType', { isAbstract: true })
@ObjectType()
@Entity({ schema: 'private_blog' })
export class Post extends CoreEntity {
  @Column({ nullable: false })
  @Field(() => String)
  @IsString()
  title: string;

  @Column({ nullable: false })
  @Field(() => String)
  @IsString()
  contents: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  excerpt?: string;

  @Column({ nullable: false, default: 0 })
  @Field(() => Int)
  @IsInt()
  hits: number;

  @ManyToOne(() => Category, (Category) => Category.post, {
    onDelete: 'SET NULL',
  })
  @Field(() => Category, { nullable: true })
  category: Category;

  @RelationId((post: Post) => post.category)
  categoryId: number;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment) => comment.post)
  comments?: Comment[];

  @Field(() => [Hashtag], { nullable: true })
  @OneToMany(() => Hashtag, (hashtag) => hashtag.post)
  hashtags?: Hashtag[];

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  thumbnailUrl?: string;

  @Column({ nullable: false })
  @Field(() => Int, { nullable: false })
  @IsNumber()
  readTime: number;

  @Column({ type: 'enum', enum: PostStatus, default: PostStatus.PUBLISHED })
  @Field(() => PostStatus)
  @IsString()
  postStatus?: PostStatus;
}
