import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-account.dto';
import { UserProfileOutput } from './dto/user-profile.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { Public } from 'src/auth/public.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UpdatePasswordOutput } from './dto/update-password.dto';
import {
  UpdateUserProfileInput,
  UpdateUserProfileOutput,
} from './dto/update-user-profile.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => CreateAccountOutput)
  @Public()
  createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.userService.createAccount(createAccountInput);
  }

  @Mutation(() => LoginOutput)
  @Public()
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.userService.login(loginInput);
  }

  @Query(() => User)
  me(@AuthUser() authUser: User): User {
    return authUser;
  }

  @Query(() => UserProfileOutput)
  userProfile(
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<UserProfileOutput> {
    return this.userService.findById(userId);
  }

  @Query(() => UserProfileOutput)
  @Public()
  userProfileByNickName(
    @Args('userNickName', { type: () => String }) userNickName: string,
  ): Promise<UserProfileOutput> {
    return this.userService.findByNickName(userNickName);
  }

  @Mutation(() => UpdatePasswordOutput)
  updatePassword(
    @AuthUser() AuthUser: User,
    @Args('password', { type: () => String }) password: string,
  ) {
    return this.userService.updatePassword(AuthUser, password);
  }

  @Mutation(() => UpdateUserProfileOutput)
  updateUserProfile(
    @AuthUser() AuthUser: User,
    @Args('input') updateUserProfileInput: UpdateUserProfileInput,
  ) {
    return this.userService.updateUserProfile(AuthUser, updateUserProfileInput);
  }
}
