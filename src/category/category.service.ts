import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { CreateCategoryOutput } from './dto/create-category.dto';
import { DeleteCategoryOutput } from './dto/delete-category.dto';
import { EditCategoryInput, EditCategoryOutput } from './dto/edit-category.dto';
import {
  GetCategoriesCountOutput,
  GetCategoriesOutput,
  GetParentCategoriesOutput,
} from './dto/get-categories.dto';
import { PostUseYn } from 'src/post/entity/post.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly category: Repository<Category>,
  ) {}

  async createCategory(
    categoryTitle: string,
    categoryParentId?: number,
  ): Promise<CreateCategoryOutput> {
    try {
      // 1. 카테고리 이름 중복 체크
      const existCategoryTitle = await this.category.findOne({
        where: { categoryTitle },
      });

      if (existCategoryTitle) {
        return {
          ok: false,
          error: '같은 이름의 카테고리가 존재합니다.',
        };
      }

      // 2. 부모 카테고리 존재 여부 체크 (부모 ID가 있는 경우만)
      if (categoryParentId) {
        const existParentCategory = await this.category.findOne({
          where: { id: categoryParentId },
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
        where: {
          parentCategoryId: categoryParentId || null,
        },
      });

      const newCategory = this.category.create({
        categoryTitle,
      });

      if (categoryParentCheck.length > 0) {
        newCategory.sortOrder = categoryParentCheck.length + 1;
      } else {
        newCategory.sortOrder = 1;
      }

      if (categoryParentId) {
        newCategory.parentCategoryId = categoryParentId;
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

  async editCategory({
    id,
    categoryTitle,
  }: EditCategoryInput): Promise<EditCategoryOutput> {
    try {
      const category = await this.findOneCategoryById(id);

      if (!category) {
        return {
          ok: false,
          error: '카테고리가 존재하지 않습니다.',
        };
      }

      await this.category.save([
        {
          id,
          categoryTitle,
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
        order: { sortOrder: 'ASC' },
      });
      return {
        ok: true,
        categories: getCategories,
      };
    } catch (e) {
      return {
        ok: false,
        error: '카테고리를 가져 올 수 없습니다. 관리자에게 문의해 주세요.',
      };
    }
  }

  async findOneCategoryById(categoryId: number): Promise<Category> {
    const category = await this.category.findOne({
      where: { id: categoryId },
    });

    return category;
  }

  async getCategoryCounts(): Promise<GetCategoriesCountOutput> {
    const categoryCounts = [];
    const map = new Map();

    const getCategories = await this.category
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.post', 'post', 'post.postUseYn = :useYn', {
        useYn: PostUseYn.Y,
      })
      .getMany();

    if (getCategories.length > 0) {
      getCategories.forEach((category) => {
        map.set(category.id, {
          ...category,
          count: category.post?.length || 0,
          children: [],
        });
      });
    }

    getCategories.forEach((category) => {
      const node = map.get(category.id);
      if (category.parentCategoryId) {
        const parent = map.get(category.parentCategoryId);
        if (parent) {
          parent.children.push(node);
          parent.count += node.count;
        }
      } else {
        categoryCounts.push(node);
      }
    });

    return {
      ok: true,
      categoryCounts,
    };
  }

  async getParentCategories(): Promise<GetParentCategoriesOutput> {
    const getParentCategories = await this.category.find({
      where: { parentCategoryId: null },
      order: { sortOrder: 'DESC' },
    });

    return {
      ok: true,
      categories: getParentCategories,
    };
  }
}
