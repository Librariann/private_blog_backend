import { Post } from './entity/post.entity';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { PostService } from './post.service';
import { CreatePostInput, CreatePostOutput } from './dto/create-post.dto';
import { GetPostListOutput } from './dto/get-post-list.dto';
import { EditPostInput, EditPostOutput } from './dto/edit-post.dto';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => CreatePostOutput)
  createPost(
    @Args('input') createPostInput: CreatePostInput,
  ): Promise<CreatePostOutput> {
    return this.postService.createPost(createPostInput);
  }

  @Mutation(() => EditPostOutput)
  editPost(
    @Args('input') editPostInput: EditPostInput,
  ): Promise<EditPostOutput> {
    return this.postService.editPost(editPostInput);
  }

  @Query(() => GetPostListOutput)
  getPostList(): Promise<GetPostListOutput> {
    return this.postService.getPostList();
  }
}
