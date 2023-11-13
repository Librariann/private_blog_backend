import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-account.dto';
import { UserProfileOutput } from './dto/user-profile.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => CreateAccountOutput)
  createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.userService.createAccount(createAccountInput);
  }

  @Query(() => UserProfileOutput)
  userProfile(
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<UserProfileOutput> {
    return this.userService.findById(userId);
  }
}
