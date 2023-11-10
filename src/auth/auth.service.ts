import { Injectable } from '@nestjs/common';
import { LoginUserInput } from './dto/login-user.input';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { CreateUserInput } from 'src/user/dto/create-user.input';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(loginUserInput: LoginUserInput) {
    const { email, password } = loginUserInput;

    const user = await this.userService.findOneByEmail(email);

    const hasMatched = await bcrypt.compare(password, user?.password);

    if (user && hasMatched) {
      return user;
    }
    return null;
  }

  login(user: User) {
    return {
      user,
      authToken: this.jwtService.sign(
        {
          email: user.email,
          name: user.firstName,
          sub: user._id,
        },
        {
          secret:
            this.configService.get<string>('JWT_SECRET') || 'testingEnvSecret',
        },
      ),
    };
  }

  async signup(payload: CreateUserInput) {
    // CHECK IF THE USER ALREADY EXISTS
    const user = await this.userService.findOneByEmail(payload.email);

    if (user) {
      throw new Error('User already exists, login instead');
    }

    // GENERATE HASH PASSWORD TO SAVE
    const hash = await bcrypt.hash(
      payload.password,
      Number(this.configService.get<string>('SALT_ROUND') || '8'),
    );

    return this.userService.createUser({ ...payload, password: hash });
  }
}
