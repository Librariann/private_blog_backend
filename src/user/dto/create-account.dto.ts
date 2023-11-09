import { PickType, ObjectType, InputType } from '@nestjs/graphql';
import { User } from '../entity/user.entity';
import { Output } from 'src/common/dto/output.dto';

@InputType()
export class CreateAccountInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class CreateAccountOutput extends Output {}
