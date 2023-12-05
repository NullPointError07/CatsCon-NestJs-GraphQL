import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginUserInput } from './dto/login-user.input';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { CreateUserInput } from 'src/user/dto/create-user.input';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(loginUserInput: LoginUserInput) {
    const { email, password } = loginUserInput;

    const user = await this.userService.findOneByEmail(email);
    const hasMatched = await bcrypt.compare(password, user?.password);

    if (user && hasMatched) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const accessToken = this.jwtService.sign(
      {
        email: user.email,
        name: user.userName,
        sub: user._id,
      },
      {
        secret:
          this.configService.get<string>('JWT_SECRET') || 'testingEnvSecret',
      },
    );

    // const refreshToken = this.jwtService.sign(
    //   {
    //     email: user.email,
    //     name: user.userName,
    //     sub: user._id,
    //   },
    //   {
    //     secret:
    //       this.configService.get<string>('JWT_SECRET') || 'testingEnvSecret',
    //   },
    // );

    return { user, accessToken };
  }

  async signup(createUserInput: CreateUserInput) {
    const user = await this.userService.findOneByEmail(createUserInput.email);

    if (user) {
      throw new Error('User already exists, login instead');
    }

    // GENERATE HASH PASSWORD TO SAVE
    const hash = await bcrypt.hash(
      createUserInput.password,
      Number(this.configService.get<string>('SALT_ROUND') || '8'),
    );

    return this.userService.createUser({ ...createUserInput, password: hash });
  }
}
