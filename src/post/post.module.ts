import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { Category } from 'src/category/entity/category.entity';
import { CategoryModule } from 'src/category/category.module';
import { Hashtag } from 'src/hashtag/entity/hashtag.entity';
import { HashtagModule } from 'src/hashtag/hashtag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Category, Hashtag]),
    CategoryModule,
    HashtagModule,
  ],
  providers: [PostResolver, PostService],
  exports: [PostService],
})
export class PostModule {}
