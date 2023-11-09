import { CoreEntity } from 'src/common/entity/core.entity';
import { Column, Entity } from 'typeorm';
import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { IsString, IsEmail } from 'class-validator';

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  @Field(() => String)
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Field(() => String)
  @IsString()
  password: string;
}
