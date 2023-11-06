import { ObjectType, Field } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
// import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@ObjectType()
export class Cat {
  @Field(() => String)
  @Prop()
  name: string;

  @Field(() => String)
  @Prop()
  breed: string;

  @Field(() => String)
  @Prop()
  image: string;
}
