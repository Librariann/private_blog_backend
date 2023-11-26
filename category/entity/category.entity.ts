import { CoreEntity } from 'src/common/entity/core.entity';
import { Entity, Column } from 'typeorm';
import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {
  @Column({ nullable: false })
  @Field(() => String)
  @IsString()
  name: string;
}
