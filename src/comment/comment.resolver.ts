import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import {
  CreateCommentInput,
  CreateCommentOutput,
} from './dto/create-comment.dto';
import { User } from 'src/user/entity/user.entity';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { DeleteCommentOutput } from './dto/delete-comment.dto';
import { EditCommentInput, EditCommentOutput } from './dto/edit-comment.dto';
import { Comment } from './entity/comment.entity';
import { Public } from 'src/auth/public.decorator';
import { GetCommentOutput } from './dto/get-comment.dto';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Mutation(() => CreateCommentOutput)
  @Public()
  createComment(
    // @AuthUser() authUser: User,
    @Args('input') createCommentInput: CreateCommentInput,
  ): Promise<CreateCommentOutput> {
    return this.commentService.createComment(createCommentInput);
  }
  @Mutation(() => EditCommentOutput)
  @Public()
  editComment(
    @AuthUser() user: User,
    @Args('input') editCommentInput: EditCommentInput,
  ): Promise<EditCommentOutput> {
    return this.commentService.editComment(user, editCommentInput);
  }

  @Mutation(() => DeleteCommentOutput)
  @Public()
  deleteComment(@Args('commentId', { type: () => Int }) commentId: number) {
    return this.commentService.deleteComment(commentId);
  }

  @Query(() => GetCommentOutput)
  @Public()
  getCommentList(@Args('postId', { type: () => Int }) postId: number) {
    return this.commentService.getComments(postId);
  }
}
