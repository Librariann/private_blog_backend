import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../entity/user.entity';
import { Output } from 'src/common/dto/output.dto';

@ObjectType()
export class UserProfileOutput extends Output {
  @Field(() => User, { nullable: true })
  user?: User;
}
