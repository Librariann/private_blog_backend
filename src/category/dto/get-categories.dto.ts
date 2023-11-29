import { ObjectType, Field } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';
import { Category } from '../entity/category.entity';

@ObjectType()
export class GetCategoriesOutput extends Output {
  @Field(() => [Category], { nullable: true })
  categories?: Category[];
}
