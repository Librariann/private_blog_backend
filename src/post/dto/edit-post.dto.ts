import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';
import { Post } from '../entity/post.entity';

@InputType()
export class EditPostInput extends PickType(Post, [
  'id',
  'title',
  'contents',
]) {}

@ObjectType()
export class EditPostOutput extends Output {}
