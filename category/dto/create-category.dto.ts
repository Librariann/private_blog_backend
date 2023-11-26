import { PickType, ObjectType, InputType, Int, Field } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';
import { Category } from 'category/entity/category.entity';

@InputType()
export class CreateCategoryInput extends PickType(Category, ['name']) {}

@ObjectType()
export class CreateCategoryOutput extends Output {
  @Field(() => Int)
  categoryId?: number;
}
