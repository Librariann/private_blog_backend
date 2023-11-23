import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import {
  CreateCommentInput,
  CreateCommentOutput,
} from './dto/create-comment.dto';
import { User } from 'src/user/entity/user.entity';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { DeleteCommentOutput } from './dto/delete-comment.dto';

@Resolver()
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Mutation(() => CreateCommentOutput)
  createComment(
    @AuthUser() authUser: User,
    @Args('input') createCommentInput: CreateCommentInput,
  ): Promise<CreateCommentOutput> {
    return this.commentService.createComment(authUser, createCommentInput);
  }

  @Mutation(() => DeleteCommentOutput)
  deleteComment(@Args('commentId', { type: () => Int }) commentId: number) {
    return this.commentService.deleteComment(commentId);
  }
}
