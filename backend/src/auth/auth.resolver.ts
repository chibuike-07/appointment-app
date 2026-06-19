import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './auth.response';
import { RegisterArgs } from './dto/register.args';
import { LoginArgs } from './dto/login.args';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => Boolean)
  async register(
    @Args() args: RegisterArgs,
  ) {
    await this.authService.register(
      args.email,
      args.password,
      args.firstName,
      args.lastName,
    );
    return true;
  }

  @Mutation(() => AuthResponse)
  login(
    @Args() args: LoginArgs,
  ) {
    return this.authService.login(
      args.email,
      args.password,
    );
  }
}
