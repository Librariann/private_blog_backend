import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';

@InputType()
export class UpdateHashTagInput {
  @Field(() => Int)
  postId?: number;
}

@ObjectType()
export class UpdateHashTagOutput extends Output {}
