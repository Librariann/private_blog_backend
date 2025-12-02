import { PickType, ObjectType, InputType, Int, Field } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';
import { Category } from 'src/category/entity/category.entity';

@InputType()
export class CreateCategoryInput extends PickType(Category, ['categoryTitle']) {
  @Field(() => Int, { nullable: true })
  depth?: number;

  @Field(() => Int, { nullable: true })
  parentCategoryId?: number;

  @Field(() => Int, { nullable: true })
  sortOrder?: number;

  @Field(() => String, { nullable: true })
  icon?: string;

  @Field(() => String, { nullable: true })
  iconColor?: string;

  @Field(() => String, { nullable: true })
  description?: string;
}

@ObjectType()
export class CreateCategoryOutput extends Output {
  @Field(() => Int, { nullable: true })
  categoryId?: number;
}
