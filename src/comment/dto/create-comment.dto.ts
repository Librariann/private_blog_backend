import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { Comment } from '../entity/comment.entity';
import { Output } from 'src/common/dto/output.dto';

@InputType()
export class CreateCommentInput extends PickType(Comment, [
  'comment',
  'commentId',
  'commentPassword',
]) {
  @Field(() => Int)
  postId: number;
}

@ObjectType()
export class CreateCommentOutput extends Output {
  @Field(() => Int)
  commentId?: number;
}
