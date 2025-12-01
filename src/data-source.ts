import { DataSource } from 'typeorm';
import { Category } from './category/entity/category.entity';
import { Comment } from './comment/entity/comment.entity';
import { Hashtag } from './hashtag/entity/hashtag.entity';
import { Post } from './post/entity/post.entity';
import { User } from './user/entity/user.entity';
import * as dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config({
  path: process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev',
});

const isProd = process.env.NODE_ENV === 'prod';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'private_blog',
  entities: [User, Post, Comment, Category, Hashtag],
  migrations: [isProd ? 'dist/migrations/*.js' : 'src/migrations/*.ts'],
  synchronize: false,
});
