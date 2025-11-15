import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';

@ObjectType()
export class HashtagCount {
  @Field(() => String)
  hashtag: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class GetAllPopularHashTagsOutput extends Output {
  @Field(() => [HashtagCount], { nullable: false })
  hashtags?: HashtagCount[];
}
