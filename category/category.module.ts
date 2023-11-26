import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { CommentResolver } from 'src/comment/comment.resolver';
import { CommentService } from 'src/comment/comment.service';
@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CommentResolver, CommentService],
  exports: [CommentService],
})
export class CategoryModule {}
