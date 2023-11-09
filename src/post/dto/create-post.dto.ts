import { PickType, ObjectType, InputType } from '@nestjs/graphql';
import { Post } from '../entity/post.entity';
import { Output } from 'src/common/dto/output.dto';

@InputType()
export class CreatePostInput extends PickType(Post, ['title', 'contents']) {}

@ObjectType()
export class CreatePostOutput extends Output {}
