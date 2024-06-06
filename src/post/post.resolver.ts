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
import { GetPostOneOutput } from './dto/get-post-one.dto';
import { Public } from 'src/auth/public.decorator';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => CreatePostOutput)
  createPost(
    @AuthUser() authUser: User,
    @Args('input') createPostInput: CreatePostInput,
  ): Promise<CreatePostOutput> {
    return this.postService.createPost(authUser, createPostInput);
  }

  @Mutation(() => EditPostOutput)
  editPost(
    @AuthUser() postUser: User,
    @Args('input') editPostInput: EditPostInput,
  ): Promise<EditPostOutput> {
    return this.postService.editPost(postUser, editPostInput);
  }

  @Mutation(() => DeletePostOutput)
  deletePost(@Args('postId', { type: () => Int }) postId: number) {
    return this.postService.deletePost(postId);
  }

  @Mutation(() => UpdatePostHitsOutput)
  updatePostHits(@Args('postId', { type: () => Int }) postId: number) {
    return this.postService.updatePostHits(postId);
  }

  @Query(() => GetPostListOutput)
  getPostList(): Promise<GetPostListOutput> {
    return this.postService.getPostList();
  }

  @Query(() => GetPostOneOutput, { nullable: true })
  getPostOne(
    @Args('postId', { type: () => Int }) postId: number,
  ): Promise<GetPostOneOutput> {
    return this.postService.getPostFindOne(postId);
  }

  @Query(() => getPostListByCategoryIdOutput, { nullable: true })
  @Public()
  getPostListByCategoryId(
    @Args('categoryId', { type: () => Int }) categoryId: number,
  ): Promise<getPostListByCategoryIdOutput> {
    return this.postService.getPostListByCategoryId(categoryId);
  }
}
