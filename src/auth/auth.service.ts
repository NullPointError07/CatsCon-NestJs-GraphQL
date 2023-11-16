import { Injectable } from '@nestjs/common';
import { LoginUserInput } from './dto/login-user.input';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { CreateUserInput } from 'src/user/dto/create-user.input';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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
      return user;
    }
    return null;
  }

  // login(user: User) {
  //   return {
  //     user,
  //     authToken: this.jwtService.sign(
  //       {
  //         email: user.email,
  //         name: user.userName,
  //         sub: user._id,
  //       },
  //       {
  //         secret:
  //           this.configService.get<string>('JWT_SECRET') || 'testingEnvSecret',
  //       },
  //     ),
  //   };
  // }

  async login(user: User) {
    const authToken = this.jwtService.sign(
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
    console.log('user', user);
    const decodedToken = this.jwtService.decode(authToken);
    console.log('Decoded Token:', decodedToken);

    return { user, authToken };
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
