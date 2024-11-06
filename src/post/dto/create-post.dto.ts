import { PickType, ObjectType, InputType, Int, Field } from '@nestjs/graphql';
import { Post, PostStatus } from '../entity/post.entity';
import { Output } from 'src/common/dto/output.dto';

@InputType()
export class CreatePostInput extends PickType(Post, ['title', 'contents']) {
  @Field(() => Int, { nullable: false })
  categoryId: number;

  @Field(() => String, { nullable: true })
  thumbnailUrl?: string;

  @Field(() => String, { nullable: true })
  excerpt?: string;

  @Field(() => PostStatus, {
    nullable: false,
    defaultValue: PostStatus.PUBLISHED,
  })
  postStatus: PostStatus;
}

@ObjectType()
export class CreatePostOutput extends Output {
  @Field(() => Int)
  postId?: number;
}
