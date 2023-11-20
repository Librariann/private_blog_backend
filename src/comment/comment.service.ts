import { Injectable } from '@nestjs/common';
import {
  CreateCommentInput,
  CreateCommentOutput,
} from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly comment: Repository<Comment>,
  ) {}
  async createComment(
    commentUser: User,
    createCommentInput: CreateCommentInput,
  ): Promise<CreateCommentOutput> {
    try {
      console.log(createCommentInput);
      const newComment = this.comment.create(createCommentInput);
      newComment.user = commentUser;
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
