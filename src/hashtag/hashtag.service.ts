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
import {
  UpdateHashTagInput,
  UpdateHashTagOutput,
} from './dto/update-hashtag.dto';

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

  async updateHashTag({
    hashtag,
    postId,
  }: UpdateHashTagInput): Promise<UpdateHashTagOutput> {
    try {
      const existHashtags = await this.hashtag.find({
        where: {
          postId,
        },
      });

      // 현재 해시태그를 배열로 변환
      const existingHashtagNames = existHashtags.map((tag) => tag.hashtag);
      const newHashtags = hashtag.split(',');

      // 추가할 해시태그와 삭제할 해시태그 결정
      const hashtagsToAdd = newHashtags.filter(
        (tag) => !existingHashtagNames.includes(tag),
      );
      const hashtagsToRemove = existingHashtagNames.filter(
        (tag) => !newHashtags.includes(tag),
      );

      // 새로운 해시태그 추가
      for (const hashtag of hashtagsToAdd) {
        await this.hashtag.save({
          hashtag,
          postId,
        });
      }

      // 기존 해시태그 삭제
      for (const hashtag of hashtagsToRemove) {
        await this.hashtag.delete({
          hashtag,
          postId,
        });
      }

      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '해시태그를 업데이트 할 수 없습니다. 관리자에게 문의해주세요',
      };
    }
  }
}
