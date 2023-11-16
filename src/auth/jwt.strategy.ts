import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    console.log('Validating user:', payload);
    const JwtStrategy = {
      _id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
    console.log('jwt strategy', JwtStrategy);

    return JwtStrategy;
  }
}
