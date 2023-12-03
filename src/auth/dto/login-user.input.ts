import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class LoginUserInput {
  @IsEmail()
  @Field(() => String)
  email: string;

  @IsString()
  @Field(() => String)
  password: string;
}
