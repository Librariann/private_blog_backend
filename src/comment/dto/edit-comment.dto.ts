import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';
import { Comment } from '../entity/comment.entity';

@InputType()
export class EditCommentInput extends PickType(Comment, ['id', 'comment']) {}

@ObjectType()
export class EditPostOutput extends Output {}
