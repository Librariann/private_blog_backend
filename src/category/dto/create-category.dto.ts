import { PickType, ObjectType, InputType, Int, Field } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';
import { Category } from 'src/category/entity/category.entity';

@InputType()
export class CreateCategoryInput extends PickType(Category, [
  'categoryTitle',
]) {}

@ObjectType()
export class CreateCategoryOutput extends Output {
  @Field(() => Int)
  categoryId?: number;
}
