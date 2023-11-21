import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';
import { Post } from 'src/post/entity/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post])],
  providers: [CommentResolver, CommentService],
  exports: [CommentService],
})
export class CommentModule {}
