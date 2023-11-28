import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';
import { Category } from '../entity/category.entity';

@InputType()
export class EditCategoryInput extends PickType(Category, [
  'id',
  'categoryTitle',
]) {}

@ObjectType()
export class EditCategoryOutput extends Output {}
