import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostResolver, PostService],
  exports: [PostService],
})
export class PostModule {}
