import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entity/user.entity';
import { Output } from 'src/common/dto/output.dto';

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOutput extends Output {
  @Field(() => String, { nullable: true })
  token?: string;
}
