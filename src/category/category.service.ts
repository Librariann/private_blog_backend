import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dto/create-category.dto';
import { DeleteCategoryOutput } from './dto/delete-category.dto';

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
        error: '카테고리를 삭제 할 수 없습니다. 관리자에게 문의해 주세요',
      };
    }
  }
}
