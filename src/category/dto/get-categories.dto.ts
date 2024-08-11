import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';
import { Category } from '../entity/category.entity';

@ObjectType()
export class CategoryCount {
  @Field(() => String)
  categoryTitle: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class GetCategoriesOutput extends Output {
  @Field(() => [Category], { nullable: true })
  categories?: Category[];
}

@ObjectType()
export class GetCategoriesCountOutput extends Output {
  @Field(() => [CategoryCount], { nullable: true })
  categoryCounts?: CategoryCount[];
}
