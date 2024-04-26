import { Query, Mutation, Resolver } from '@nestjs/graphql';
import { Hashtag } from './entity/hashtag.entity';
import { GetHashTagOutput } from './dto/get-hashtag-list.dto';
import { HashtagService } from './hashtag.service';
import { CreateHashTagOutput } from './dto/create-hashtag.dto';

@Resolver(() => Hashtag)
export class HashtagResolver {
  constructor(private readonly hashtagService: HashtagService) {}

  @Mutation(() => CreateHashTagOutput)
  createHashTag(): Promise<CreateHashTagOutput> {
    return this.hashtagService.createHashTag();
  }

  @Query(() => GetHashTagOutput)
  getHashTagList(): Promise<GetHashTagOutput> {
    return this.hashtagService.getHashTagList();
  }
}
