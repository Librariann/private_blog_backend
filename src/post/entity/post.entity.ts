import { CoreEntity } from 'src/common/entity/core.entity';
import { Entity, Column } from 'typeorm';
import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType('PostInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Post extends CoreEntity {
  @Column({ nullable: false })
  @Field(() => String)
  @IsString()
  title: string;

  @Column({ nullable: false })
  @Field(() => String)
  @IsString()
  contents: string;
}
