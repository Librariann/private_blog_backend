import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dto/create-category.dto';
import { Category } from './entity/category.entity';
import { CategoryService } from './category.service';
import { DeleteCategoryOutput } from './dto/delete-category.dto';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => CreateCategoryOutput)
  createCategory(
    @Args('input') createCategoryInput: CreateCategoryInput,
  ): Promise<CreateCategoryOutput> {
    return this.categoryService.createCategory(createCategoryInput);
  }

  @Mutation(() => DeleteCategoryOutput)
  deleteCategory(
    @Args('categoryId', { type: () => Int }) categoryId: number,
  ): Promise<DeleteCategoryOutput> {
    return this.categoryService.deleteCategory(categoryId);
  }
}
