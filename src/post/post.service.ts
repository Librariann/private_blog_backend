import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { CreatePostInput, CreatePostOutput } from './dto/create-post.dto';
import { GetPostListOutput } from './dto/get-post-list.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly post: Repository<Post>,
  ) {}

  async createPost({
    title,
    contents,
  }: CreatePostInput): Promise<CreatePostOutput> {
    try {
      await this.post.save(this.post.create({ title, contents }));
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '게시글을 작성 할 수 없습니다',
      };
    }
  }

  async getPostList(): Promise<GetPostListOutput> {
    try {
      const postList = await this.post.find();
      return {
        ok: true,
        posts: postList,
      };
    } catch (e) {
      return {
        ok: false,
        error: '리스트를 가져올 수 없습니다.',
      };
    }
  }
}
