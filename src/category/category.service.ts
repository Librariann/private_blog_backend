import { Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dto/create-category.dto';
import { DeleteCategoryOutput } from './dto/delete-category.dto';
import { EditCategoryInput, EditCategoryOutput } from './dto/edit-category.dto';
import {
  GetCategoriesCountOutput,
  GetCategoriesOutput,
  GetCategoryByIdOutput,
  GetParentCategoriesOutput,
} from './dto/get-categories.dto';
import { PostStatus } from 'src/post/entity/post.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly category: Repository<Category>,
  ) {}

  async createCategory(
    createCategory: CreateCategoryInput,
  ): Promise<CreateCategoryOutput> {
    try {
      // 1. 카테고리 이름 중복 체크
      const existCategoryTitle = await this.category.findOne({
        where: { categoryTitle: createCategory.categoryTitle },
      });

      if (existCategoryTitle && !existCategoryTitle?.parentCategory.id) {
        return {
          ok: false,
          error: '같은 이름의 메인 카테고리가 존재합니다.',
        };
      }

      if (
        existCategoryTitle &&
        existCategoryTitle?.parentCategory?.id ===
          createCategory?.parentCategoryId
      ) {
        return {
          ok: false,
          error: '같은 이름의 서브 카테고리가 존재합니다.',
        };
      }

      // 2. 부모 카테고리 존재 여부 체크 (부모 ID가 있는 경우만)
      if (createCategory?.parentCategoryId) {
        const existParentCategory = await this.category.findOne({
          where: { id: createCategory.parentCategoryId },
        });

        if (!existParentCategory) {
          return {
            ok: false,
            error: '부모 카테고리가 존재하지 않습니다.',
          };
        }
      }

      // 3. 같은 부모 하위의 카테고리 개수 조회 (sortOrder 계산용)
      const categoryParentCheck = await this.category.find({
        where: createCategory?.parentCategoryId
          ? { parentCategory: { id: createCategory.parentCategoryId } }
          : { parentCategory: IsNull() },
      });

      const newCategory = this.category.create(createCategory);
      if (categoryParentCheck.length > 0) {
        newCategory.sortOrder = categoryParentCheck.length + 1;
      } else {
        newCategory.sortOrder = 1;
      }

      if (createCategory?.parentCategoryId) {
        const parentCategory = await this.category.findOne({
          where: { id: createCategory.parentCategoryId },
        });
        newCategory.parentCategory = parentCategory;
      }

      await this.category.save(newCategory);

      return {
        ok: true,
        categoryId: newCategory.id,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '카테고리를 생성 할 수 없습니다.',
      };
    }
  }

  async editCategory(
    editCategory: EditCategoryInput,
  ): Promise<EditCategoryOutput> {
    try {
      const category = await this.findOneCategoryById(editCategory.id);

      if (!category.category) {
        return {
          ok: false,
          error: '카테고리가 존재하지 않습니다.',
        };
      }

      await this.category.save([
        {
          id: editCategory.id,
        },
        {
          ...editCategory,
        },
      ]);

      return {
        ok: true,
        error: '카테고리가 수정되었습니다.',
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '카테고리를 수정 할 수 없습니다.',
      };
    }
  }

  async deleteCategory(categoryId: number): Promise<DeleteCategoryOutput> {
    try {
      const existCategory = await this.category.findOne({
        where: { id: categoryId },
      });

      if (!existCategory) {
        return {
          ok: false,
          error: '카테고리가 존재 하지 않습니다 다시한번 확인해주세요.',
        };
      }

      await this.category.delete({
        id: categoryId,
      });

      return {
        ok: true,
        error: '카테고리를 삭제했습니다',
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '카테고리를 삭제 할 수 없습니다. 관리자에게 문의해 주세요.',
      };
    }
  }

  async getCategories(): Promise<GetCategoriesOutput> {
    try {
      const getCategories = await this.category.find({
        relations: ['subCategories', 'parentCategory'],
        where: { parentCategory: IsNull() },
        order: { sortOrder: 'ASC' },
      });

      return {
        ok: true,
        categories: getCategories,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '카테고리를 가져 올 수 없습니다. 관리자에게 문의해 주세요.',
      };
    }
  }

  async findOneCategoryById(
    categoryId: number,
  ): Promise<GetCategoryByIdOutput> {
    const category = await this.category.findOne({
      where: { id: categoryId },
    });

    return {
      ok: true,
      category,
    };
  }

  async getCategoryCounts(): Promise<GetCategoriesCountOutput> {
    const getCategories = await this.category.find({
      relations: ['subCategories', 'parentCategory'],
      where: {
        parentCategory: IsNull(),
        // post: { postStatus: PostStatus.PUBLISHED },
      },
      order: { sortOrder: 'ASC' },
    });
    return {
      ok: true,
      categoryCounts: getCategories,
    };
  }

  async getParentCategories(): Promise<GetParentCategoriesOutput> {
    const getParentCategories = await this.category.find({
      where: { parentCategory: IsNull() },
      order: { sortOrder: 'DESC' },
    });

    return {
      ok: true,
      categories: getParentCategories,
    };
  }
}
