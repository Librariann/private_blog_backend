import { PickType, ObjectType, InputType, Int, Field } from '@nestjs/graphql';
import { Post } from '../entity/post.entity';
import { Output } from 'src/common/dto/output.dto';

@InputType()
export class CreatePostInput extends PickType(Post, ['title', 'contents']) {
  @Field(() => Int)
  categoryId?: number;
}

@ObjectType()
export class CreatePostOutput extends Output {
  @Field(() => Int)
  postId?: number;
}
