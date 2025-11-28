import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';
import { Category } from '../entity/category.entity';

@ObjectType()
export class CategoryCount extends Category {
  @Field(() => Int, { nullable: true })
  count?: number;
}

@ObjectType()
export class GetCategoriesOutput extends Output {
  @Field(() => [Category], { nullable: true })
  categories?: Category[];
}

@ObjectType()
export class GetCategoryByIdOutput extends Output {
  @Field(() => Category, { nullable: true })
  category?: Category;
}

@ObjectType()
export class GetCategoriesCountOutput extends Output {
  @Field(() => [CategoryCount], { nullable: true })
  categoryCounts?: CategoryCount[];
}

@ObjectType()
export class GetParentCategoriesOutput extends Output {
  @Field(() => [Category], { nullable: true })
  categories?: Category[];
}
