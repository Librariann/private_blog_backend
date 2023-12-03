import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostInput, CreatePostOutput } from './dto/create-post.dto';
import { GetPostListOutput } from './dto/get-post-list.dto';
import { EditPostInput, EditPostOutput } from './dto/edit-post.dto';
import { DeletePostOutput } from './dto/delete-post.dto';
import { User } from 'src/user/entity/user.entity';
import { Category } from 'src/category/entity/category.entity';
import { Post } from 'src/post/entity/post.entity';
import { UpdatePostHitsOutput } from './dto/update-post-hits.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly post: Repository<Post>,

    @InjectRepository(Category)
    private readonly category: Repository<Category>,
  ) {}

  async createPost(
    user: User,
    createPostInput: CreatePostInput,
  ): Promise<CreatePostOutput> {
    try {
      const getCategory = await this.category.findOneByOrFail({
        id: createPostInput.categoryId,
      });
      if (!getCategory) {
        return {
          ok: false,
          error: '카테고리가 없습니다 다시한번 확인해주세요.',
        };
      }
      const newPost = this.post.create(createPostInput);
      newPost.user = user;
      newPost.category = getCategory;
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
      const existPost = await this.getPostFindOne(id);

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

  async updatePostHits(postId: number): Promise<UpdatePostHitsOutput> {
    try {
      const existPost = await this.getPostFindOne(postId);
      if (!existPost) {
        return {
          ok: false,
          error: '해당 게시글이 존재하지 않습니다. 다시한번 확인해주세요.',
        };
      }
      await this.post.save([
        {
          id: postId,
          hits: existPost.hits + 1,
        },
      ]);

      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
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

  //post find one
  async getPostFindOne(postId: number): Promise<Post> {
    const post = await this.post.findOneOrFail({
      where: {
        id: postId,
      },
    });

    return post;
  }

  //유저 비교
  comparePostUser(user: User, post: Post): boolean {
    let allowed = true;
    if (user.id !== post.user.id) {
      allowed = false;
    }

    return allowed;
  }
}
