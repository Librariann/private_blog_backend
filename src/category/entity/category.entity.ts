import { CoreEntity } from 'src/common/entity/core.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { Post } from 'src/post/entity/post.entity';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Entity({ schema: 'private_blog' })
export class Category extends CoreEntity {
  @Column({ nullable: false })
  @Field(() => String)
  @IsString()
  categoryTitle: string;

  @Column({ nullable: true })
  @Field(() => Number, { nullable: true })
  @IsNumber()
  depth?: number;

  @Column({ nullable: true })
  @Field(() => Number, { nullable: true })
  @IsNumber()
  parentCategoryId?: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  parentCategoryTitle?: string;

  @Field(() => [Category], { nullable: true })
  subCategories?: Category[];

  @Column({ nullable: true })
  @Field(() => Number, { nullable: true })
  @IsNumber()
  sortOrder?: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  icon?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  iconColor?: string;

  @OneToMany(() => Post, (post) => post.category, {
    onDelete: 'SET NULL',
    eager: true,
  })
  post: Post[];
}
