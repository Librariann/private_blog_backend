import { Post } from './entity/post.entity';
import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { PostService } from './post.service';
import { CreatePostInput, CreatePostOutput } from './dto/create-post.dto';
import { GetPostListOutput } from './dto/get-post-list.dto';
import { EditPostInput, EditPostOutput } from './dto/edit-post.dto';
import { DeletePostOutput } from './dto/delete-post.dto';
import { User } from 'src/user/entity/user.entity';
import { AuthUser } from 'src/auth/auth-user.decorator';

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

  @Query(() => GetPostListOutput)
  getPostList(): Promise<GetPostListOutput> {
    return this.postService.getPostList();
  }
}
