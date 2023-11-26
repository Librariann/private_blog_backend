import { Resolver } from '@nestjs/graphql';
import { CommentService } from 'src/comment/comment.service';
import { Comment } from 'src/comment/entity/comment.entity';

@Resolver(() => Comment)
export class PostResolver {
  constructor(private readonly commentService: CommentService) {}
}
