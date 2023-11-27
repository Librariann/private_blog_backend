import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { Category } from 'src/category/entity/category.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Post, Category])],
  providers: [PostResolver, PostService],
  exports: [PostService],
})
export class PostModule {}
