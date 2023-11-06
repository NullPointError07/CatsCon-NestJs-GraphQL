import { InputType, Field } from '@nestjs/graphql';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';
// import { FileUpload } from './upload-type';

@InputType()
export class CreateCatInput {
  @Field(() => String)
  name: string;
  @Field(() => String)
  breed: string;
  @Field(() => GraphQLUpload)
  image: Upload;
}
