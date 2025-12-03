import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dto/create-category.dto';
import { Category } from './entity/category.entity';
import { CategoryService } from './category.service';
import { DeleteCategoryOutput } from './dto/delete-category.dto';
import {
  EditCategoryInput,
  EditCategoryOutput,
  EditSortCategoryInput,
  EditSortCategoryOutput,
} from './dto/edit-category.dto';
import {
  GetCategoriesCountOutput,
  GetCategoriesOutput,
  GetCategoryByIdOutput,
} from './dto/get-categories.dto';
import { Public } from 'src/auth/public.decorator';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => CreateCategoryOutput)
  createCategory(
    @Args('input') createCategoryInput: CreateCategoryInput,
  ): Promise<CreateCategoryOutput> {
    return this.categoryService.createCategory(createCategoryInput);
  }

  @Mutation(() => EditCategoryOutput)
  editCategory(
    @Args('input') editCategoryInput: EditCategoryInput,
  ): Promise<EditCategoryOutput> {
    return this.categoryService.editCategory(editCategoryInput);
  }

  @Mutation(() => EditSortCategoryOutput)
  editSortCategory(
    @Args('input', { type: () => EditSortCategoryInput })
    editSortCategoryInput: EditSortCategoryInput,
  ): Promise<EditSortCategoryOutput> {
    return this.categoryService.editSortCategory(editSortCategoryInput);
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

  @Query(() => GetCategoryByIdOutput)
  @Public()
  findOneCategoryById(
    @Args('categoryId', { type: () => Int }) categoryId: number,
  ): Promise<GetCategoryByIdOutput> {
    return this.categoryService.findOneCategoryById(categoryId);
  }

  @Query(() => GetCategoriesCountOutput)
  @Public()
  getCategoriesCounts(): Promise<GetCategoriesCountOutput> {
    return this.categoryService.getCategoryCounts();
  }
}
