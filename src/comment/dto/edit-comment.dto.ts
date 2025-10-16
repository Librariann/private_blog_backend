import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';

@InputType()
export class EditCommentInput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  commentPassword: string;

  @Field(() => String)
  comment: string;
}

@ObjectType()
export class EditCommentOutput extends Output {}
