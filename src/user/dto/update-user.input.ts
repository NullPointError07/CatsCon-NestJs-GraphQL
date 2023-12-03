import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEmail, IsNumber, IsString} from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @IsString()
  @Field(() => String, { nullable: true })
  userName: string;

  @IsEmail()
  @Field(() => String, { nullable: true })
  email: string;

  @IsString()
  @Field(() => String, { nullable: true })
  password: string;

  @IsNumber()
  @Field(() => Int, { nullable: true })
  age: number;

  @IsString()
  @Field(() => String, { nullable: true })
  address: string;

  @IsString()
  @Field(() => String, { nullable: true })
  bio: string;
}
