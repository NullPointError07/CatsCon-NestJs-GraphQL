import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginUserResponse } from './dto/login-response';
import { UseGuards } from '@nestjs/common/decorators';
import { LoginUserInput } from './dto/login-user.input';
import { GqlAuthGuard } from './gql-auth.guards';
import { User } from 'src/user/entities/user.entity';
import { CreateUserInput } from 'src/user/dto/create-user.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginUserResponse)
  @UseGuards(GqlAuthGuard)
  login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() context: any,
  ) {
    console.log('does this work', context.user);

    return this.authService.login(context.user);
  }

  @Mutation(() => User)
  signup(@Args('signupInput') signupInput: CreateUserInput) {
    return this.authService.signup(signupInput);
  }
}
