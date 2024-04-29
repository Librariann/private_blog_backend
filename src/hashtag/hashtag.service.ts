import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hashtag } from './entity/hashtag.entity';
import { Repository } from 'typeorm';
import { GetHashTagOutput } from './dto/get-hashtag-list.dto';
import { CreateHashTagOutput } from './dto/create-hashtag.dto';

@Injectable()
export class HashtagService {
  constructor(
    @InjectRepository(Hashtag)
    private readonly hastag: Repository<Hashtag>,
  ) {}

  async getHashTagList(): Promise<GetHashTagOutput> {
    try {
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '해시태그를 가져올 수 없습니다. 관리자에게 문의해주세요.',
      };
    }
  }

  async createHashTag(): Promise<CreateHashTagOutput> {
    try {
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
}
