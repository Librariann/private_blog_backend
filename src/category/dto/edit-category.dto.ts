import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';
import { Category } from '../entity/category.entity';

@InputType()
export class EditCategoryInput extends PickType(Category, [
  'id',
  'categoryTitle',
]) {
  @Field(() => Int, { nullable: true })
  depth?: number;

  @Field(() => Int, { nullable: true })
  parentCategoryId?: number;

  @Field(() => Int, { nullable: true })
  sortOrder?: number;
}

@ObjectType()
export class EditCategoryOutput extends Output {}
