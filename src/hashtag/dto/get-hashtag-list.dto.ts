import { ObjectType, Field } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';
import { Hashtag } from '../entity/hashtag.entity';

@ObjectType()
export class GetHashTagOutput extends Output {
  @Field(() => [Hashtag], { nullable: true })
  hashtags?: Hashtag[];
}
