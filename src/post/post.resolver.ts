import { Post } from './entity/post.entity';
import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { PostService } from './post.service';
import { CreatePostInput, CreatePostOutput } from './dto/create-post.dto';
import {
  getPostListByCategoryIdOutput,
  GetPostListOutput,
} from './dto/get-post-list.dto';
import { EditPostInput, EditPostOutput } from './dto/edit-post.dto';
import { DeletePostOutput } from './dto/delete-post.dto';
import { User } from 'src/user/entity/user.entity';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UpdatePostHitsOutput } from './dto/update-post-hits.dto';
import { GetPostByIdOutput } from './dto/get-post-by-id.dto';
import { Public } from 'src/auth/public.decorator';
import { TogglePostStatus } from './dto/toggle-post-status.dto';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => CreatePostOutput)
  createPost(
    @AuthUser() authUser: User,
    @Args('input') createPostInput: CreatePostInput,
    @Args('hashtags', { type: () => [String], nullable: true })
    hashtags: string[] | null,
  ): Promise<CreatePostOutput> {
    return this.postService.createPost(authUser, createPostInput, hashtags);
  }

  @Mutation(() => EditPostOutput)
  editPost(
    @AuthUser() postUser: User,
    @Args('input') editPostInput: EditPostInput,
    @Args('hashtags', { type: () => [String], nullable: true })
    hashtags: string[] | null,
  ): Promise<EditPostOutput> {
    return this.postService.editPost(postUser, editPostInput, hashtags);
  }

  @Mutation(() => DeletePostOutput)
  deletePost(@Args('postId', { type: () => Int }) postId: number) {
    return this.postService.deletePost(postId);
  }

  @Mutation(() => TogglePostStatus)
  togglePostStatus(
    @Args('postId', { type: () => Int }) postId: number,
  ): Promise<TogglePostStatus> {
    return this.postService.togglePostStatus(postId);
  }

  @Mutation(() => UpdatePostHitsOutput)
  @Public()
  updatePostHits(@Args('postId', { type: () => Int }) postId: number) {
    return this.postService.updatePostHits(postId);
  }

  @Query(() => GetPostListOutput)
  @Public()
  getPostList(): Promise<GetPostListOutput> {
    return this.postService.getPostList();
  }

  @Query(() => GetPostByIdOutput, { nullable: true })
  @Public()
  getPostById(
    @Args('postId', { type: () => Int }) postId: number,
  ): Promise<GetPostByIdOutput> {
    return this.postService.getPostFindOne(postId);
  }

  @Query(() => getPostListByCategoryIdOutput, { nullable: true })
  @Public()
  getPostListByCategoryId(
    @Args('categoryId', { type: () => Int }) categoryId: number,
  ): Promise<getPostListByCategoryIdOutput> {
    return this.postService.getPostListByCategoryId(categoryId);
  }

  @Query(() => getPostListByCategoryIdOutput, { nullable: true })
  @Public()
  getPostsByParentCategoryId(
    @Args('categoryId', { type: () => Int }) categoryId: number,
  ): Promise<getPostListByCategoryIdOutput> {
    return this.postService.getPostsByParentCategoryId(categoryId);
  }

  @Query(() => GetPostListOutput)
  getAllPostList(): Promise<GetPostListOutput> {
    return this.postService.getAllPostList();
  }
}
