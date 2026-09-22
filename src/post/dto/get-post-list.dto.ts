import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';
import { Post } from '../entity/post.entity';

@ObjectType()
export class GetPostListOutput extends Output {
  @Field(() => [Post], { nullable: true })
  posts?: Post[];

  @Field(() => Post, { nullable: false })
  featuredPost?: Post;
}

@ObjectType()
export class GetPostListWithLimitOutput extends Output {
  @Field(() => [Post], { nullable: true })
  posts?: Post[];

  @Field(() => Post, { nullable: false })
  featuredPost?: Post;
}

@ObjectType()
export class GetPaginatedPostListOutput extends Output {
  @Field(() => [Post], { nullable: true })
  posts?: Post[];

  @Field(() => Boolean)
  hasMore: boolean;

  @Field(() => Int)
  totalCount: number;
}

@ObjectType()
export class getPostListByCategoryIdOutput extends Output {
  @Field(() => [Post], { nullable: true })
  posts?: Post[];

  @Field(() => Boolean)
  hasMore: boolean;

  @Field(() => Int)
  totalCount: number;

  @Field(() => Int)
  totalViews: number;

  @Field(() => Int)
  averageReadTime: number;
}
