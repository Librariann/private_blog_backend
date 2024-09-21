import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';

@InputType()
export class CreateHashTagInput {
  @Field(() => Int)
  postId?: number;

  @Field(() => [String])
  hashtags?: string[];
}

@ObjectType()
export class CreateHashTagOutput extends Output {
  @Field(() => Int)
  hashtagId?: number;
}
