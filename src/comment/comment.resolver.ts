import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import {
  CreateCommentInput,
  CreateCommentOutput,
} from './dto/create-comment.dto';
import {
  DeleteCommentInput,
  DeleteCommentOutput,
} from './dto/delete-comment.dto';
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
    @Args('input') editCommentInput: EditCommentInput,
  ): Promise<EditCommentOutput> {
    return this.commentService.editComment(editCommentInput);
  }

  @Mutation(() => DeleteCommentOutput)
  @Public()
  deleteComment(@Args('input') deleteCommentInput: DeleteCommentInput) {
    return this.commentService.deleteComment(deleteCommentInput);
  }

  @Mutation(() => DeleteCommentOutput)
  deleteCommentByAdmin(@Args('id', { type: () => Int }) id: number) {
    return this.commentService.deleteCommentByAdmin(id);
  }

  @Query(() => GetCommentOutput)
  getComments() {
    return this.commentService.getComments();
  }
}
