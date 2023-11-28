import { ObjectType } from '@nestjs/graphql';
import { Output } from 'src/common/dto/output.dto';

@ObjectType()
export class DeleteCategoryOutput extends Output {}
