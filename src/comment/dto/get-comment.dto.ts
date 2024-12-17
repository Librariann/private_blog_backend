import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';
import { Comment } from '../entity/comment.entity';

@InputType()
export class GetCommentInput {
  @Field(() => Int)
  postId: number;
}

@ObjectType()
export class GetCommentOutput extends Output {
  @Field(() => [Comment], { nullable: true })
  comments?: Comment[];
}
