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
      const existPost = await this.post.findOne({
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
      console.log(newComment);
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
}
