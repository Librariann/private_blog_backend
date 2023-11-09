import { CoreEntity } from 'src/common/entity/core.entity';
import { Entity } from 'typeorm';
import { Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@Entity()
export class Post extends CoreEntity {
  @Field(() => String)
  @IsString()
  title: string;

  @Field(() => String)
  @IsString()
  contents: string;
}
