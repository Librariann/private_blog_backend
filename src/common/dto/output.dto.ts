import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Output {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;
}
