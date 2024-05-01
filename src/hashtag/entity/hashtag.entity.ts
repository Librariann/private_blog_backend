import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core.entity';
import { Post } from 'src/post/entity/post.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@InputType('HashtagInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Hashtag extends CoreEntity {
  @Column({ nullable: false })
  @Field(() => String)
  @IsString()
  hashtag: string;

  @Column({ nullable: true })
  @Field(() => Number, { nullable: true })
  @IsNumber()
  postId: number;

  @ManyToOne(() => Post, (post) => post.hashtags, {
    onDelete: 'SET NULL',
    eager: true,
  })
  post: Post;
}
