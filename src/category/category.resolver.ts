import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateCategoryOutput } from './dto/create-category.dto';
import { Category } from './entity/category.entity';
import { CategoryService } from './category.service';
import { DeleteCategoryOutput } from './dto/delete-category.dto';
import { EditCategoryInput, EditCategoryOutput } from './dto/edit-category.dto';
import {
  GetCategoriesCountOutput,
  GetCategoriesOutput,
} from './dto/get-categories.dto';
import { Public } from 'src/auth/public.decorator';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => CreateCategoryOutput)
  createCategory(
    @Args('categoryTitle', { type: () => String }) categoryTitle: string,
  ): Promise<CreateCategoryOutput> {
    return this.categoryService.createCategory(categoryTitle);
  }

  @Mutation(() => EditCategoryOutput)
  editCategory(
    @Args('input') editCategoryInput: EditCategoryInput,
  ): Promise<EditCategoryOutput> {
    return this.categoryService.editCategory(editCategoryInput);
  }

  @Mutation(() => DeleteCategoryOutput)
  deleteCategory(
    @Args('categoryId', { type: () => Int }) categoryId: number,
  ): Promise<DeleteCategoryOutput> {
    return this.categoryService.deleteCategory(categoryId);
  }

  @Query(() => GetCategoriesOutput)
  @Public()
  getCategories(): Promise<GetCategoriesOutput> {
    return this.categoryService.getCategories();
  }

  @Query(() => GetCategoriesCountOutput)
  @Public()
  getCategoriesCounts(): Promise<GetCategoriesCountOutput> {
    return this.categoryService.getCategoryCounts();
  }
}
