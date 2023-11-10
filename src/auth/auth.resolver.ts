import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginUserResponse } from './dto/login.response';
import { UseGuards } from '@nestjs/common/decorators';
import { LoginUserInput } from './dto/login-user.input';

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) {}
}

@Mutation(() => LoginUserResponse)
@UseGuards(GqlAuthGuard)
login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() context: any
) {
    return this.authService.login(context.user)
}