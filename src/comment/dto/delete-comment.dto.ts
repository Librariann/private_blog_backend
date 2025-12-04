import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';

@InputType()
export class DeleteCommentInput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  commentPassword: string;
}

@ObjectType()
export class DeleteCommentOutput extends Output {
  @Field(() => Int)
  id?: number;
}
