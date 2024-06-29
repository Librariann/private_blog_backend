import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
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
} from './dto/get-categories.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly category: Repository<Category>,
  ) {}

  async createCategory({
    categoryTitle,
  }: CreateCategoryInput): Promise<CreateCategoryOutput> {
    try {
      const newCategory = this.category.create({
        categoryTitle,
      });
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
      const getCategories = await this.category.find();
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
    const categoryCounts = await this.category
      .createQueryBuilder('a')
      .innerJoin('post', 'b', 'a.id = b.categoryId') // 'post' 테이블과의 조인
      .select('a.categoryTitle', 'categoryTitle')
      .addSelect('COUNT(a.categoryTitle)', 'count')
      .addSelect('a.id', 'id')
      .groupBy('a.id')
      .getRawMany(); // 결과를 원시 데이터 형태로 가져옴

    return {
      ok: true,
      categoryCounts: categoryCounts,
    };
  }
}
