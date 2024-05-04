import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hashtag } from './entity/hashtag.entity';
import { Repository } from 'typeorm';
import { GetHashTagOutput } from './dto/get-hashtag-list.dto';
import {
  CreateHashTagInput,
  CreateHashTagOutput,
} from './dto/create-hashtag.dto';
import { Post } from 'src/post/entity/post.entity';
import { UpdateHashTagOutput } from './dto/update-hashtag.dto';

@Injectable()
export class HashtagService {
  constructor(
    @InjectRepository(Hashtag)
    private readonly hashtag: Repository<Hashtag>,

    @InjectRepository(Post)
    private readonly post: Repository<Post>,
  ) {}

  async getHashTagList(): Promise<GetHashTagOutput> {
    try {
      const hashtags = await this.hashtag.find();

      return {
        ok: true,
        hashtags,
      };
    } catch (e) {
      return {
        ok: false,
        error: '해시태그를 가져올 수 없습니다. 관리자에게 문의해주세요.',
      };
    }
  }

  async createHashTag({
    hashtag,
    postId,
  }: CreateHashTagInput): Promise<CreateHashTagOutput> {
    try {
      const post = await this.post.findOne({
        where: {
          id: postId,
        },
      });

      if (!post) {
        return {
          ok: false,
          error: '해당 게시물이 없습니다 다시 시도해 주세요',
        };
      }

      const hashtags = hashtag.split(','); //해시태그 분할

      for (hashtag of hashtags) {
        await this.hashtag.save(
          this.hashtag.create({
            hashtag,
            post,
          }),
        );
      }

      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '해시태그를 생성 할 수 없습니다. 관리자에게 문의해주세요',
      };
    }
  }

  async updateHashTag(postId: number): Promise<UpdateHashTagOutput> {
    try {
      const hashtags = await this.hashtag.find({
        where: {
          postId,
        },
      });

      console.log(hashtags);
    } catch (e) {
      return {
        ok: false,
        error: '해시태그를 업데이트 할 수 없습니다. 관리자에게 문의해주세요',
      };
    }
  }
}
