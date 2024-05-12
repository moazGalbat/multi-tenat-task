import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AccessToken } from './dto/access-token.dto';
import { RefreshTokenInput } from './dto/refresh-token.args';
import { SignupInput } from './dto/singup.input';
import { LoginInput } from './dto/login.input';

@Resolver(() => AccessToken)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AccessToken)
  async signUp(@Args('signUpInput') signUpInput: SignupInput) {
    return this.authService.signup(signUpInput);
  }

  @Mutation(() => AccessToken)
  async login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => AccessToken)
  async refreshToken(@Args() { token }: RefreshTokenInput) {
    return this.authService.refreshToken(token);
  }
}
