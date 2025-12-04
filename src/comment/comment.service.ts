import { Injectable } from '@nestjs/common';
import {
  CreateCommentInput,
  CreateCommentOutput,
} from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { Repository } from 'typeorm';
import { Post } from 'src/post/entity/post.entity';
import {
  DeleteCommentInput,
  DeleteCommentOutput,
} from './dto/delete-comment.dto';
import { EditCommentInput, EditCommentOutput } from './dto/edit-comment.dto';
import { GetCommentOutput } from './dto/get-comment.dto';
import { logger } from 'src/logger/winston';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly comment: Repository<Comment>,

    @InjectRepository(Post)
    private readonly post: Repository<Post>,
  ) {}
  async createComment({
    postId,
    comment,
    annonymousId,
    annonymousPassword,
  }: CreateCommentInput): Promise<CreateCommentOutput> {
    try {
      if (!annonymousId.trim()) {
        return {
          ok: false,
          error: '아이디를 입력 해주세요.',
        };
      }

      if (!annonymousPassword.trim()) {
        return {
          ok: false,
          error: '비밀번호를 입력 해주세요.',
        };
      }

      if (!comment.trim()) {
        return {
          ok: false,
          error: '댓글 내용을 입력해주세요.',
        };
      }

      const existPost = await this.post.findOneOrFail({
        where: {
          id: postId,
        },
      });

      const newComment = this.comment.create({
        post: existPost,
        comment: comment,
        annonymousId: annonymousId,
        annonymousPassword: annonymousPassword,
        // user: commentUser,
      });
      const commentResult = await this.comment.save(newComment);
      return {
        ok: true,
        commentResult,
        commentId: commentResult.id,
        message: '댓글이 생성 됐습니다.',
      };
    } catch (e) {
      logger.error(e, '댓글을 생성할 수 없습니다.');
      return {
        ok: false,
        error: e,
      };
    }
  }

  async editComment({
    id,
    comment,
    commentPassword,
  }: EditCommentInput): Promise<EditCommentOutput> {
    try {
      if (!comment.trim()) {
        return {
          ok: false,
          error: '댓글 내용을 입력 해주세요.',
        };
      }

      if (!commentPassword.trim()) {
        return {
          ok: false,
          error: '비밀번호를 입력 해주세요.',
        };
      }

      const existComment = await this.comment.findOneOrFail({
        where: {
          id,
        },
      });

      const passwordCheck = await existComment.checkPassword(commentPassword);

      if (!passwordCheck) {
        return {
          ok: false,
          error: '댓글 비밀번호가 일치하지 않습니다.',
        };
      }

      await this.comment.update({ id }, { comment });

      return {
        ok: true,
        error: '댓글이 수정 됐습니다.',
        message: '댓글이 수정 됐습니다.',
      };
    } catch (e) {
      logger.error(e, '댓글을 수정 할 수 없습니다.');
      return {
        ok: false,
        error: '댓글을 수정 할 수 없습니다.',
      };
    }
  }

  async deleteComment({
    id,
    commentPassword,
  }: DeleteCommentInput): Promise<DeleteCommentOutput> {
    try {
      if (!commentPassword.trim()) {
        return {
          ok: false,
          error: '비밀번호를 입력 해주세요.',
        };
      }

      const existComment = await this.comment.findOneOrFail({
        where: {
          id,
        },
      });

      const passwordCheck = await existComment.checkPassword(commentPassword);

      if (!passwordCheck) {
        return {
          ok: false,
          error: '댓글 비밀번호가 일치하지 않습니다.',
        };
      }

      await this.comment.delete({
        id,
      });

      return {
        ok: true,
        id,
        message: '댓글이 삭제 됐습니다.',
      };
    } catch (e) {
      logger.error(e, '댓글을 삭제 할 수 없습니다.');
      return {
        ok: false,
        error: '댓글을 삭제 할 수 없습니다.',
      };
    }
  }

  async deleteCommentByAdmin(id: number): Promise<DeleteCommentOutput> {
    try {
      await this.comment.findOneOrFail({
        where: {
          id,
        },
      });

      await this.comment.delete({
        id,
      });

      return {
        ok: true,
        error: '댓글 삭제가 완료됐습니다.',
      };
    } catch (e) {
      logger.error(e, '댓글을 삭제 할 수 없습니다.');
      return {
        ok: false,
        error: '댓글을 삭제 할 수 없습니다.',
      };
    }
  }

  async getComments(): Promise<GetCommentOutput> {
    try {
      const comments = await this.comment.find({
        relations: ['post'],
      });

      return {
        ok: true,
        comments: comments,
      };
    } catch (e) {
      logger.error(e, '댓글을 가져올 수 없습니다.');
      return {
        ok: false,
        error: '댓글을 가져올 수 없습니다.',
      };
    }
  }

  // compareCommentUser(user: User, comment: Comment): boolean {
  //   let allowed = true;
  //   if (user.id !== comment.user.id) {
  //     allowed = false;
  //   }

  //   return allowed;
  // }
}
