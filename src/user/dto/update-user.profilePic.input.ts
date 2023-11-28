import { InputType, Field } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';

@InputType()
export class UpdateProfilePictureInput {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => GraphQLUpload, { nullable: true })
  profilePicture?: Upload;
}
