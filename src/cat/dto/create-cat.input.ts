import { InputType, Field } from '@nestjs/graphql';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';
import { Schema as MongooseSchema } from 'mongoose';

@InputType()
export class CreateCatInput {
  @Field(() => String, { nullable: true })
  creator: MongooseSchema.Types.ObjectId;

  @Field(() => String)
  title?: string;

  @Field(() => String)
  description?: string;
  
  @Field(() => [String])
  tags?: string[];

  @Field(() => GraphQLUpload, { nullable: true })
  catVideo?: Upload;
}
