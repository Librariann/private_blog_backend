import { InputType, ObjectType, PickType, Field, Int } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';
import { Post, PostStatus } from '../entity/post.entity';

@InputType()
export class EditPostInput extends PickType(Post, ['id', 'title', 'contents']) {
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
export class EditPostOutput extends Output {}

@ObjectType()
export class UpdateFeaturedPostOutput extends Output {}
