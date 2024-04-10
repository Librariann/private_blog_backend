import { Field, ObjectType } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';

@ObjectType()
export class UpdatePasswordOutput extends Output {
  @Field(() => String, { nullable: true })
  message: string;
}
