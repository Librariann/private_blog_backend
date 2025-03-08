import { CoreEntity } from 'src/common/entity/core.entity';
import { Entity, Column, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Field, ObjectType, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';
import { Comment } from 'src/comment/entity/comment.entity';
import { User } from 'src/user/entity/user.entity';
import { Category } from 'src/category/entity/category.entity';
import { Hashtag } from 'src/hashtag/entity/hashtag.entity';

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

  @Column({ nullable: false, default: 0 })
  @Field(() => Int)
  @IsInt()
  hits: number;

  @Field(() => Category)
  @ManyToOne(() => Category, (Category) => Category.post)
  category: Category;

  @RelationId((post: Post) => post.category)
  categoryId: number;

  // @Field(() => [User])
  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Field(() => [Hashtag])
  @OneToMany(() => Hashtag, (hashtag) => hashtag.post)
  hashtags: Hashtag[];

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  thumbnailUrl: string;
}
