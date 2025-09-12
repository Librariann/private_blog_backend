import { InputType, ObjectType, PickType, Field } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';
import { Post } from '../entity/post.entity';

@InputType()
export class EditPostInput extends PickType(Post, ['id', 'title', 'contents']) {
  @Field(() => String, { nullable: true })
  thumbnailUrl?: string;
}

@ObjectType()
export class EditPostOutput extends Output {}
