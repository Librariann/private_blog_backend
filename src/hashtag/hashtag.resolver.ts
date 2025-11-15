import { Query, Mutation, Resolver, Args } from '@nestjs/graphql';
import { Hashtag } from './entity/hashtag.entity';
import { GetHashTagOutput } from './dto/get-hashtag-list.dto';
import { HashtagService } from './hashtag.service';
import {
  CreateHashTagInput,
  CreateHashTagOutput,
} from './dto/create-hashtag.dto';
import {
  UpdateHashTagInput,
  UpdateHashTagOutput,
} from './dto/update-hashtag.dto';
import { GetAllPopularHashTagsOutput } from './dto/get-all-popular-hashtags.dto';
import { Public } from 'src/auth/public.decorator';

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
    @Args('input') updateHashTagInput: UpdateHashTagInput,
  ): Promise<UpdateHashTagOutput> {
    return this.hashtagService.updateHashTag(updateHashTagInput);
  }

  @Query(() => GetHashTagOutput)
  getHashTagList(): Promise<GetHashTagOutput> {
    return this.hashtagService.getHashTagList();
  }

  @Query(() => GetAllPopularHashTagsOutput)
  @Public()
  getAllPopularHashTags(): Promise<GetAllPopularHashTagsOutput> {
    return this.hashtagService.getAllPopularHashTags();
  }
}
