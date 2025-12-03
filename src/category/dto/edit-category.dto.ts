import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';
import { Category } from '../entity/category.entity';

@InputType()
export class EditCategoryInput extends PickType(Category, ['id']) {
  @Field(() => String, { nullable: true })
  categoryTitle?: string;

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

  @Field(() => Boolean, { nullable: true })
  isParent?: boolean;

  @Field(() => String, { nullable: true })
  description?: string;
}

@ObjectType()
export class EditCategoryOutput extends Output {}

@InputType()
export class CategorySortInput {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  sortOrder: number;
}
@InputType()
export class EditSortCategoryInput {
  @Field(() => [CategorySortInput], { nullable: true })
  editSortCategories: CategorySortInput[];
}

@ObjectType()
export class EditSortCategoryOutput extends Output {}
