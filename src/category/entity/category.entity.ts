import { CoreEntity } from 'src/common/entity/core.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Post } from 'src/post/entity/post.entity';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {
  @Column({ nullable: false })
  @Field(() => String)
  @IsString()
  categoryTitle: string;

  @OneToMany(() => Post, (post) => post.category, {
    onDelete: 'SET NULL',
    eager: true,
  })
  post: Post;
}
