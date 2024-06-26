import { ObjectType, Field } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';
import { Post } from '../entity/post.entity';

@ObjectType()
export class GetPostByIdOutput extends Output {
  @Field(() => Post, { nullable: true })
  post?: Post;
}
