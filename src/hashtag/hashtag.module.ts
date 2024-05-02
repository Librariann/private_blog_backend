import { Module } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { HashtagResolver } from './hashtag.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hashtag } from './entity/hashtag.entity';
import { Post } from 'src/post/entity/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hashtag, Post])],
  providers: [HashtagResolver, HashtagService],
  exports: [HashtagService],
})
export class HashtagModule {}
