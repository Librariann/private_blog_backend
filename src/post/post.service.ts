import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostInput, CreatePostOutput } from './dto/create-post.dto';
import {
  getPostListByCategoryIdOutput,
  GetPostListOutput,
} from './dto/get-post-list.dto';
import { EditPostInput, EditPostOutput } from './dto/edit-post.dto';
import { DeletePostOutput } from './dto/delete-post.dto';
import { User } from 'src/user/entity/user.entity';
import { Category } from 'src/category/entity/category.entity';
import { Post, PostStatus } from 'src/post/entity/post.entity';
import { UpdatePostHitsOutput } from './dto/update-post-hits.dto';
import { GetPostByIdOutput } from './dto/get-post-by-id.dto';
import { logger } from 'src/logger/winston';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { TogglePostStatus } from './dto/toggle-post-status.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly post: Repository<Post>,

    @InjectRepository(Category)
    private readonly category: Repository<Category>,

    private readonly hashtagService: HashtagService,
  ) {}

  async createPost(
    user: User,
    createPostInput: CreatePostInput,
    hashtags: string[] | null,
  ): Promise<CreatePostOutput> {
    try {
      const getCategory = await this.category.findOneByOrFail({
        id: createPostInput.categoryId,
      });

      const newPost = this.post.create(createPostInput);
      newPost.user = user;
      newPost.category = getCategory;

      if (newPost.contents) {
        newPost.readTime = this.calculateReadTime(newPost.contents);
      }

      await this.post.save(newPost);
      if (hashtags && hashtags.length > 0) {
        await this.hashtagService.createHashTag({
          hashtags,
          postId: newPost.id,
        });
      }
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
    updatePost: EditPostInput,
    hashtags: string[] | null,
  ): Promise<EditPostOutput> {
    try {
      const existPost = await this.getPostFindOne(updatePost.id);
      const compareUserBool = this.comparePostUser(user, existPost.post);

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

      const getCategory = await this.category.findOneByOrFail({
        id: updatePost.categoryId,
      });

      const createEditPost = this.post.create(updatePost);
      createEditPost.category = getCategory;

      if (updatePost.contents) {
        createEditPost.readTime = this.calculateReadTime(updatePost.contents);
      }

      await this.post.update({ id: updatePost.id }, createEditPost);
      await this.hashtagService.updateHashTag({
        hashtags,
        postId: updatePost.id,
      });

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
      await this.post.findOneByOrFail({
        id: postId,
      });

      await this.post.update(
        {
          id: postId,
        },
        {
          postStatus: PostStatus.DELETED,
        },
      );

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

  async togglePostStatus(postId: number): Promise<TogglePostStatus> {
    try {
      const postExistCheck = await this.post.findOneByOrFail({
        id: postId,
      });

      let postStatus = postExistCheck.postStatus;
      if (postStatus !== PostStatus.PUBLISHED) {
        postStatus = PostStatus.PUBLISHED;
      } else {
        postStatus = PostStatus.PRIVATE;
      }

      await this.post.update(
        {
          id: postId,
        },
        {
          postStatus,
        },
      );

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
          hits: existPost.post.hits + 1,
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
      const posts = await this.post.find({
        relations: ['category', 'hashtags', 'comments'],
        order: {
          createdAt: 'DESC',
        },
        where: {
          postStatus: PostStatus.PUBLISHED,
        },
      });

      return {
        ok: true,
        posts,
      };
    } catch (e) {
      return {
        ok: false,
        error: '리스트를 가져올 수 없습니다.',
      };
    }
  }

  //post find one
  async getPostFindOne(postId: number): Promise<GetPostByIdOutput> {
    try {
      const post = await this.post.findOne({
        where: {
          id: postId,
        },
        relations: ['category', 'comments', 'hashtags', 'user'],
      });

      if (!post) {
        return {
          ok: false,
          error: '게시물이 존재하지 않습니다.',
        };
      }

      return {
        ok: true,
        post,
      };
    } catch (e) {
      logger.error(e);
      return {
        ok: false,
        error: `관리자에게 문의해주세요 ${e}`,
      };
    }
  }

  async getPostListByCategoryId(
    categoryId: number,
  ): Promise<getPostListByCategoryIdOutput> {
    try {
      const posts = await this.post.find({
        where: {
          category: {
            id: categoryId,
          },
          postStatus: PostStatus.PUBLISHED,
        },
        relations: ['category', 'comments', 'hashtags'],
        order: {
          createdAt: 'DESC',
        },
      });

      if (!posts) {
        return {
          ok: false,
          error: '게시물이 존재하지 않습니다.',
        };
      }

      return {
        ok: true,
        posts,
      };
    } catch (e) {
      console.error(e);
      return {
        ok: false,
        error: `관리자에게 문의해주세요 ${e}`,
      };
    }
  }

  async getPostsByParentCategoryId(
    categoryId: number,
  ): Promise<getPostListByCategoryIdOutput> {
    try {
      const posts = await this.post.find({
        where: {
          category: {
            parentCategory: {
              id: categoryId,
            },
          },
          postStatus: PostStatus.PUBLISHED,
        },
        relations: ['category', 'comments', 'hashtags'],
        order: {
          createdAt: 'DESC',
        },
      });

      if (!posts) {
        return {
          ok: false,
          error: '게시물이 존재하지 않습니다.',
        };
      }

      const getParentCategory = await this.category.findOneByOrFail({
        id: categoryId,
      });

      posts?.forEach((post) => {
        post.category.parentCategory.categoryTitle =
          getParentCategory.categoryTitle;
      });

      return {
        ok: true,
        posts,
      };
    } catch (e) {
      return {
        ok: false,
        error: `관리자에게 문의해주세요 ${e}`,
      };
    }
  }

  async getAllPostList(): Promise<GetPostListOutput> {
    try {
      const posts = await this.post.find({
        relations: [
          'category',
          'category.parentCategory',
          'category.parentCategory.subCategories',
          'hashtags',
          'comments',
        ],
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        ok: true,
        posts,
      };
    } catch (e) {
      return {
        ok: false,
        error: '리스트를 가져올 수 없습니다.',
      };
    }
  }

  //유저 비교
  comparePostUser(user: User, post: Post): boolean {
    if (user.id !== post.user.id) {
      return false;
    }

    return true;
  }

  calculateReadTime(contents: string): number {
    const avgChars = 350;
    const totalChars = contents.replace(/\s/g, '').length;
    const readTimeMinutes = Math.ceil(totalChars / avgChars);

    return Math.max(1, readTimeMinutes);
  }
}
