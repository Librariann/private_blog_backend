import { Module, Post } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { HashtagResolver } from './hashtag.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [HashtagResolver, HashtagService],
  exports: [HashtagService],
})
export class HashtagModule {}
