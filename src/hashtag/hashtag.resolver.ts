import { Resolver } from '@nestjs/graphql';
import { Hashtag } from './entity/hashtag.entity';
// import { HashtagService } from './hashtag.service';

@Resolver(() => Hashtag)
export class HashtagResolver {
  // constructor(private readonly hashtagService: HashtagService)
}
