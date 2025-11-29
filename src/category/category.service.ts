import { Injectable } from '@nestjs/common';
import { IsNull, ILike, Repository } from 'typeorm';
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
      const isParent: boolean = Boolean(!createCategory.parentCategoryId);

      //상위 카테고리 작성 - 부모카테고리 아이디가 없을때

      // 1. 카테고리 이름 중복 체크
      const existCategory = await this.category.findOne({
        where: {
          parentCategory: isParent
            ? { id: createCategory?.parentCategoryId } //부모카테고리가 있을때
            : IsNull(), //부모카테고리가 없을때
          categoryTitle: ILike(createCategory.categoryTitle),
        },
        relations: ['parentCategory'],
      });

      if (
        isParent &&
        existCategory &&
        createCategory?.categoryTitle?.toLowerCase() ===
          existCategory?.categoryTitle?.toLowerCase()
      ) {
        return {
          ok: false,
          error: '같은 이름의 상위 카테고리가 존재합니다.',
        };
      }

      if (
        !isParent &&
        existCategory &&
        createCategory?.categoryTitle?.toLowerCase() ===
          existCategory?.categoryTitle?.toLowerCase()
      ) {
        return {
          ok: false,
          error: '같은 이름의 하위 카테고리가 존재합니다.',
        };
      }

      // 2. 같은 부모 하위의 카테고리 개수 조회 (sortOrder 계산용)
      const categoryParentCheck = await this.category.find({
        where: {
          parentCategory: createCategory?.parentCategoryId
            ? { id: createCategory.parentCategoryId }
            : IsNull(),
        },
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
      const existCategory = await this.category.findOne({
        where: {
          parentCategory: editCategory.isParent
            ? { id: editCategory?.parentCategoryId } //부모카테고리가 있을때
            : IsNull(), //부모카테고리가 없을때
          categoryTitle: ILike(editCategory.categoryTitle),
        },
      });
      console.log(editCategory, existCategory);

      if (
        editCategory.isParent &&
        existCategory &&
        editCategory?.categoryTitle?.toLowerCase() ===
          existCategory?.categoryTitle?.toLowerCase()
      ) {
        return {
          ok: false,
          error: '같은 이름의 상위 카테고리가 존재합니다.',
        };
      }

      if (
        !editCategory.isParent &&
        existCategory &&
        editCategory?.categoryTitle?.toLowerCase() ===
          existCategory?.categoryTitle?.toLowerCase()
      ) {
        return {
          ok: false,
          error: '같은 이름의 하위 카테고리가 존재합니다.',
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

  async deleteCategory(
    categoryId: number,
    isParent: boolean,
  ): Promise<DeleteCategoryOutput> {
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
      if (isParent) {
        await this.category.delete({
          parentCategory: { id: categoryId },
        });
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
