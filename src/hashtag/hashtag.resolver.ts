import { Query, Mutation, Resolver, Args, Int } from '@nestjs/graphql';
import { Hashtag } from './entity/hashtag.entity';
import { GetHashTagOutput } from './dto/get-hashtag-list.dto';
import { HashtagService } from './hashtag.service';
import {
  CreateHashTagInput,
  CreateHashTagOutput,
} from './dto/create-hashtag.dto';
import { UpdateHashTagOutput } from './dto/update-hashtag.dto';

@Resolver(() => Hashtag)
export class HashtagResolver {
  constructor(private readonly hashtagService: HashtagService) {}

  @Mutation(() => CreateHashTagOutput)
  createHashTag(
    @Args('input') createHashTagInput: CreateHashTagInput,
  ): Promise<CreateHashTagOutput> {
    return this.hashtagService.createHashTag(createHashTagInput);
  }

  @Mutation(() => UpdateHashTagOutput)
  updateHashTag(
    @Args('postId', { type: () => Int }) postId: number,
  ): Promise<UpdateHashTagOutput> {
    return this.hashtagService.updateHashTag(postId);
  }

  @Query(() => GetHashTagOutput)
  getHashTagList(): Promise<GetHashTagOutput> {
    return this.hashtagService.getHashTagList();
  }
}
