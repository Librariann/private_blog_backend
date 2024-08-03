import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core.entity';
import { Post } from 'src/post/entity/post.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@ObjectType()
@Entity()
export class Hashtag extends CoreEntity {
  @Column({ nullable: false })
  @Field(() => String)
  @IsString()
  name: string;

  @ManyToOne(() => Post, (post) => post.hashtags, {
    onDelete: 'SET NULL',
    eager: true,
  })
  post: Post;
}
