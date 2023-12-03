import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';
import { Schema as MongooseSchema } from 'mongoose';

@InputType()
export class CreateCatInput {
  creator: MongooseSchema.Types.ObjectId;

  @IsString()
  @Field(() => String)
  title?: string;

  @IsString()
  @Field(() => String)
  description?: string;

  @Field(() => [String])
  tags?: string[];

  @Field(() => GraphQLUpload, { nullable: true })
  catVideo?: Upload;
}
