import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dto/create-category.dto';
import { Category } from './entity/category.entity';
import { CategoryService } from './category.service';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => CreateCategoryOutput)
  createCategory(
    @Args('input') createCategoryInput: CreateCategoryInput,
  ): Promise<CreateCategoryOutput> {
    return this.categoryService.createCategory(createCategoryInput);
  }
}
