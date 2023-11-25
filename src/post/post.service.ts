import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { CreatePostInput, CreatePostOutput } from './dto/create-post.dto';
import { GetPostListOutput } from './dto/get-post-list.dto';
import { EditPostInput, EditPostOutput } from './dto/edit-post.dto';
import { DeletePostOutput } from './dto/delete-post.dto';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly post: Repository<Post>,
  ) {}

  async createPost(
    user: User,
    createPostInput: CreatePostInput,
  ): Promise<CreatePostOutput> {
    try {
      const newPost = this.post.create(createPostInput);
      newPost.user = user;
      await this.post.save(newPost);
      return {
        ok: true,
        postId: newPost.id,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '게시글을 작성 할 수 없습니다',
      };
    }
  }

  async editPost(
    user: User,
    { id, title, contents }: EditPostInput,
  ): Promise<EditPostOutput> {
    try {
      const existPost = await this.post.findOneOrFail({
        where: {
          id,
        },
      });

      const compareUserBool = this.comparePostUser(user, existPost);

      if (!compareUserBool) {
        return {
          ok: false,
          error: '작성된 글의 유저가 아닙니다.',
        };
      }

      if (!existPost) {
        return {
          ok: false,
          error: '해당 글이 존재하지 않습니다.',
        };
      }

      await this.post.save([
        {
          id,
          title,
          contents,
        },
      ]);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '게시글을 수정 할 수 없습니다.',
      };
    }
  }

  async deletePost(postId: number): Promise<DeletePostOutput> {
    try {
      const postExistCheck = await this.post.findOneByOrFail({
        id: postId,
      });

      if (!postExistCheck) {
        return {
          ok: false,
          error: '해당 게시글이 없습니다.',
        };
      }

      await this.post.delete({
        id: postId,
      });

      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '게시글을 삭제 할 수 없습니다.',
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

  comparePostUser(user: User, post: Post): boolean {
    let allowed = true;
    if (user.id !== post.user.id) {
      allowed = false;
    }

    return allowed;
  }
}
