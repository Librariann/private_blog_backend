import { Injectable } from '@nestjs/common';
import {
  CreateCommentInput,
  CreateCommentOutput,
} from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { Post } from 'src/post/entity/post.entity';
import { DeleteCommentOutput } from './dto/delete-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly comment: Repository<Comment>,

    @InjectRepository(Post)
    private readonly post: Repository<Post>,
  ) {}
  async createComment(
    commentUser: User,
    { postId, comment }: CreateCommentInput,
  ): Promise<CreateCommentOutput> {
    try {
      const existPost = await this.post.findOneOrFail({
        where: {
          id: postId,
        },
      });
      if (!existPost) {
        return {
          ok: false,
          error: '해당 글이 존재하지 않습니다.',
        };
      }
      const newComment = this.comment.create({
        post: existPost,
        comment: comment,
        user: commentUser,
      });
      await this.comment.save(newComment);
      return {
        ok: true,
        commentId: newComment.id,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: e,
      };
    }
  }

  async deleteComment(commentId: number): Promise<DeleteCommentOutput> {
    try {
      const existComment = await this.comment.findOneOrFail({
        where: {
          id: commentId,
        },
      });
      if (!existComment) {
        return {
          ok: false,
          error: '해당 댓글이 존재하지 않습니다.',
        };
      }
      await this.comment.delete({
        id: commentId,
      });
      return {
        ok: true,
        error: '댓글 삭제가 완료됐습니다.',
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '댓글을 삭제 할 수 없습니다.',
      };
    }
  }
}
