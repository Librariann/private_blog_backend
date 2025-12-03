import { Injectable } from '@nestjs/common';
import { IsNull, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dto/create-category.dto';
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
import { PostStatus } from 'src/post/entity/post.entity';
import { logger } from 'src/logger/winston';

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
            ? IsNull() //상위 카테고리 일때
            : { id: createCategory?.parentCategoryId }, //하위 카테고리일때
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
      logger.error('카테고리를 생성 할 수 없습니다.', e);
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
      const existParentCategory = await this.category.findOne({
        where: {
          id: editCategory.id,
        },
        relations: ['parentCategory'],
      });
      const isParent = Boolean(!existParentCategory?.parentCategory); //상위인지, 하위인지 확인 ParentCategory가 없으면 상위

      const existCategory = await this.category.findOne({
        where: {
          parentCategory: isParent
            ? IsNull() //상위 카테고리 일때
            : { id: existParentCategory?.parentCategory?.id }, //하위 카테고리 일때
          categoryTitle: ILike(editCategory.categoryTitle),
        },
        relations: ['parentCategory'],
      });

      if (
        isParent &&
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
        !isParent &&
        existCategory &&
        editCategory?.categoryTitle?.toLowerCase() ===
          existCategory?.categoryTitle?.toLowerCase()
      ) {
        return {
          ok: false,
          error: '같은 이름의 하위 카테고리가 존재합니다.',
        };
      }

      let editParentCategory = null;
      if (editCategory?.parentCategoryId) {
        const parentCategory = await this.category.findOne({
          where: { id: editCategory.parentCategoryId },
        });
        editParentCategory = parentCategory;
      }

      await this.category.save([
        {
          id: editCategory.id,
        },
        {
          ...editCategory,
          ...(editParentCategory && { parentCategory: editParentCategory }),
        },
      ]);

      return {
        ok: true,
        error: '카테고리가 수정되었습니다.',
      };
    } catch (e) {
      logger.error('카테고리를 수정 할 수 없습니다.', e);
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
      logger.error(
        '카테고리를 삭제 할 수 없습니다. 관리자에게 문의해 주세요.',
        e,
      );
      return {
        ok: false,
        error: '카테고리를 삭제 할 수 없습니다. 관리자에게 문의해 주세요.',
      };
    }
  }

  async getCategories(): Promise<GetCategoriesOutput> {
    try {
      const getCategories = await this.category
        .createQueryBuilder('category')
        .leftJoinAndSelect('category.subCategories', 'subCategories')
        .leftJoinAndSelect('subCategories.parentCategory', 'subParentCategory')
        .leftJoinAndSelect('category.parentCategory', 'parentCategory')
        .leftJoinAndSelect(
          'subCategories.post',
          'post',
          'post.postStatus = :status',
          { status: PostStatus.PUBLISHED },
        )
        .where('category.parentCategory IS NULL')
        .orderBy('category.sortOrder', 'ASC')
        .getMany();
      return {
        ok: true,
        categories: getCategories,
      };
    } catch (e) {
      logger.error(
        '카테고리를 가져 올 수 없습니다. 관리자에게 문의해 주세요.',
        e,
      );
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

  async editSortCategory({
    editSortCategories,
  }: EditSortCategoryInput): Promise<EditSortCategoryOutput> {
    try {
      await this.category.save(editSortCategories);
      return {
        ok: true,
      };
    } catch (e) {
      logger.error(e, '순서를 변경 할 수 없습니다.');
      return {
        ok: false,
        error: '순서를 변경 할 수 없습니다',
      };
    }
  }
}
