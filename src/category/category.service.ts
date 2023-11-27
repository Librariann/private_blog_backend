import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dto/create-category.dto';
import { Post } from 'src/post/entity/post.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly category: Repository<Category>,

    @InjectRepository(Post)
    private readonly post: Repository<Post>,
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
}
