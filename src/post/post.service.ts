import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostInput, CreatePostOutput } from './dto/create-post.dto';
import {
  GetPaginatedPostListOutput,
  getPostListByCategoryIdOutput,
  GetPostListOutput,
  GetPostListWithLimitOutput,
} from './dto/get-post-list.dto';
import {
  EditPostInput,
  EditPostOutput,
  UpdateFeaturedPostOutput,
} from './dto/edit-post.dto';
import { DeletePostOutput } from './dto/delete-post.dto';
import { User } from 'src/user/entity/user.entity';
import { Category } from 'src/category/entity/category.entity';
import { FeatureStatus, Post, PostStatus } from 'src/post/entity/post.entity';
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
      logger.error(e);
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
      logger.error(e);
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
      logger.error(e);
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
      logger.error(e);
      return {
        ok: false,
        error: '게시글을 삭제 할 수 없습니다.',
      };
    }
  }

  async updateFeaturedPost(postId: number): Promise<UpdateFeaturedPostOutput> {
    try {
      const prevFeaturedPost = await this.post.findOneByOrFail({
        featureYn: FeatureStatus.Y,
      });

      const getPost = await this.post.findOneByOrFail({
        id: postId,
      });

      const saveItems = [
        {
          id: prevFeaturedPost.id,
          featureYn: FeatureStatus.N,
        },
        {
          id: getPost.id,
          featureYn: FeatureStatus.Y,
        },
      ];

      this.post.save(saveItems);

      return {
        ok: true,
        message: 'feature 업데이트가 완료됐습니다.',
      };
    } catch (e) {
      logger.error(e);
      return {
        ok: false,
        error: 'feature 업데이트를 할 수 없습니다.',
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
      logger.error(e);
    }
  }

  async getPostList(): Promise<GetPostListOutput> {
    try {
      const posts = await this.post.find({
        relations: [
          'category',
          'hashtags',
          'comments',
          'category.parentCategory',
        ],
        order: {
          createdAt: 'DESC',
        },
        where: {
          postStatus: PostStatus.PUBLISHED,
        },
      });
      const featuredPost = await this.post.findOneOrFail({
        where: { featureYn: FeatureStatus.Y },
        relations: [
          'category',
          'hashtags',
          'comments',
          'category.parentCategory',
        ],
      });

      return {
        ok: true,
        posts,
        featuredPost,
      };
    } catch (e) {
      return {
        ok: false,
        error: '리스트를 가져올 수 없습니다.',
      };
    }
  }

  async getPaginatedPostList(
    offset = 0,
    limit = 10,
    searchQuery?: string,
    categoryTitle?: string,
  ): Promise<GetPaginatedPostListOutput> {
    try {
      const normalizedOffset = Math.max(0, offset);
      const normalizedLimit = Math.min(Math.max(1, limit), 50);
      const query = this.post
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.category', 'category')
        .leftJoinAndSelect('category.parentCategory', 'parentCategory')
        .leftJoinAndSelect('post.hashtags', 'hashtags')
        .select([
          'post.id',
          'post.title',
          'post.excerpt',
          'post.hits',
          'post.thumbnailUrl',
          'post.createdAt',
          'post.readTime',
          'category.id',
          'category.categoryTitle',
          'parentCategory.id',
          'parentCategory.categoryTitle',
          'hashtags.id',
          'hashtags.hashtag',
        ])
        .where('post.postStatus = :status', {
          status: PostStatus.PUBLISHED,
        })
        .orderBy('post.createdAt', 'DESC')
        .skip(normalizedOffset)
        .take(normalizedLimit);

      const normalizedSearchQuery = searchQuery?.trim().toLowerCase();
      if (normalizedSearchQuery) {
        query.andWhere(
          `(LOWER(post.title) LIKE :searchQuery OR LOWER(COALESCE(post.excerpt, '')) LIKE :searchQuery)`,
          { searchQuery: `%${normalizedSearchQuery}%` },
        );
      }

      if (categoryTitle) {
        query.andWhere('category.categoryTitle = :categoryTitle', {
          categoryTitle,
        });
      }

      const [posts, totalCount] = await query.getManyAndCount();

      return {
        ok: true,
        posts,
        hasMore: normalizedOffset + posts.length < totalCount,
        totalCount,
      };
    } catch (e) {
      logger.error(e);
      return {
        ok: false,
        error: '리스트를 가져올 수 없습니다.',
        posts: [],
        hasMore: false,
        totalCount: 0,
      };
    }
  }

  async getPostListWithLimit(): Promise<GetPostListWithLimitOutput> {
    try {
      const limit = 10;
      const posts = await this.post.find({
        relations: ['category', 'hashtags', 'category.parentCategory'],
        take: limit,
        order: {
          createdAt: 'DESC',
        },
        where: {
          postStatus: PostStatus.PUBLISHED,
        },
      });

      const featuredPost = await this.post.findOneOrFail({
        where: { featureYn: FeatureStatus.Y },
        relations: ['category', 'hashtags', 'category.parentCategory'],
      });

      return {
        ok: true,
        posts,
        featuredPost,
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
      const post = await this.post
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.category', 'category')
        .leftJoinAndSelect('post.comments', 'comments')
        .leftJoinAndSelect('post.hashtags', 'hashtags')
        .leftJoinAndSelect('post.user', 'user')
        .leftJoinAndSelect('category.parentCategory', 'parentCategory')
        .where('post.id = :postId', { postId })
        .orderBy('comments.createdAt', 'DESC') // comments 정렬
        .getOne();

      if (!post) {
        return {
          ok: false,
          error: '게시물이 존재하지 않습니다.',
        };
      }

      const prevPost = await this.post
        .createQueryBuilder('post')
        .select(['post.id', 'post.title', 'post.createdAt', 'post.readTime'])
        .where('post.category.id = :categoryId', {
          categoryId: post.category.id,
        })
        .leftJoinAndSelect('post.category', 'category')
        .andWhere('post.createdAt < :createdAt', { createdAt: post.createdAt })
        .andWhere('post.postStatus = :status', { status: PostStatus.PUBLISHED })
        .orderBy('post.createdAt', 'DESC')
        .limit(1)
        .getOne();

      const nextPost = await this.post
        .createQueryBuilder('post')
        .select(['post.id', 'post.title', 'post.createdAt', 'post.readTime'])
        .where('post.category.id = :categoryId', {
          categoryId: post.category.id,
        })
        .leftJoinAndSelect('post.category', 'category')
        .andWhere('post.createdAt > :createdAt', { createdAt: post.createdAt })
        .andWhere('post.postStatus = :status', { status: PostStatus.PUBLISHED })
        .andWhere('post.id != :postId', { postId: post.id })
        .orderBy('post.createdAt', 'ASC')
        .limit(1)
        .getOne();

      return {
        ok: true,
        post,
        prevPost,
        nextPost,
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
    offset = 0,
    limit = 10,
  ): Promise<getPostListByCategoryIdOutput> {
    try {
      const normalizedOffset = Math.max(0, offset);
      const normalizedLimit = Math.min(Math.max(1, limit), 50);
      const where = {
        category: {
          id: categoryId,
        },
        postStatus: PostStatus.PUBLISHED,
      };
      const [posts, totalCount] = await this.post.findAndCount({
        where,
        relations: [
          'category',
          'comments',
          'hashtags',
          'category.parentCategory',
        ],
        order: {
          createdAt: 'DESC',
        },
        skip: normalizedOffset,
        take: normalizedLimit,
      });

      const metrics = await this.post
        .createQueryBuilder('post')
        .select('COALESCE(SUM(post.hits), 0)', 'totalViews')
        .addSelect('COALESCE(AVG(post.readTime), 0)', 'averageReadTime')
        .leftJoin('post.category', 'category')
        .where('category.id = :categoryId', { categoryId })
        .andWhere('post.postStatus = :status', {
          status: PostStatus.PUBLISHED,
        })
        .getRawOne<{ totalViews: string; averageReadTime: string }>();

      return {
        ok: true,
        posts,
        hasMore: normalizedOffset + posts.length < totalCount,
        totalCount,
        totalViews: Number(metrics?.totalViews || 0),
        averageReadTime: Math.round(Number(metrics?.averageReadTime || 0)),
      };
    } catch (e) {
      console.error(e);
      return {
        ok: false,
        error: `관리자에게 문의해주세요 ${e}`,
        hasMore: false,
        totalCount: 0,
        totalViews: 0,
        averageReadTime: 0,
      };
    }
  }

  async getPostsByParentCategoryId(
    categoryId: number,
    offset = 0,
    limit = 10,
  ): Promise<getPostListByCategoryIdOutput> {
    try {
      const normalizedOffset = Math.max(0, offset);
      const normalizedLimit = Math.min(Math.max(1, limit), 50);
      const where = {
        category: {
          parentCategory: {
            id: categoryId,
          },
        },
        postStatus: PostStatus.PUBLISHED,
      };
      const [posts, totalCount] = await this.post.findAndCount({
        where,
        relations: [
          'category',
          'comments',
          'hashtags',
          'category.parentCategory',
        ],
        order: {
          createdAt: 'DESC',
        },
        skip: normalizedOffset,
        take: normalizedLimit,
      });

      const metrics = await this.post
        .createQueryBuilder('post')
        .select('COALESCE(SUM(post.hits), 0)', 'totalViews')
        .addSelect('COALESCE(AVG(post.readTime), 0)', 'averageReadTime')
        .leftJoin('post.category', 'category')
        .leftJoin('category.parentCategory', 'parentCategory')
        .where('parentCategory.id = :categoryId', { categoryId })
        .andWhere('post.postStatus = :status', {
          status: PostStatus.PUBLISHED,
        })
        .getRawOne<{ totalViews: string; averageReadTime: string }>();

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
        hasMore: normalizedOffset + posts.length < totalCount,
        totalCount,
        totalViews: Number(metrics?.totalViews || 0),
        averageReadTime: Math.round(Number(metrics?.averageReadTime || 0)),
      };
    } catch (e) {
      return {
        ok: false,
        error: `관리자에게 문의해주세요 ${e}`,
        hasMore: false,
        totalCount: 0,
        totalViews: 0,
        averageReadTime: 0,
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
