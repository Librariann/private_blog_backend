import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';

@InputType()
export class UpdateUserProfileInput {
  @Field(() => String, { nullable: true })
  nickname?: string;

  @Field(() => String, { nullable: true })
  profileImage?: string;

  @Field(() => String, { nullable: true })
  introduce?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => String, { nullable: true })
  website?: string;

  @Field(() => String, { nullable: true })
  role?: string;

  @Field(() => String, { nullable: true })
  location?: string;
}

@ObjectType()
export class UpdateUserProfileOutput extends Output {}
