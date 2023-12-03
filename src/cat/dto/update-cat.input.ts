import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

@InputType()
export class UpdateCatInput {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @IsString()
  @Field(() => String, { nullable: true })
  title?: string;

  @IsString()
  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}
