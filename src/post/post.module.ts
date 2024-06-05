import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { Category } from 'src/category/entity/category.entity';
import { CategoryModule } from 'src/category/category.module';
@Module({
  imports: [TypeOrmModule.forFeature([Post, Category]), CategoryModule],
  providers: [PostResolver, PostService],
  exports: [PostService],
})
export class PostModule {}
