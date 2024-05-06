import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';
import { Hashtag } from '../entity/hashtag.entity';

@InputType()
export class UpdateHashTagInput extends PickType(Hashtag, ['hashtag']) {
  @Field(() => Int)
  postId?: number;
}

@ObjectType()
export class UpdateHashTagOutput extends Output {}
