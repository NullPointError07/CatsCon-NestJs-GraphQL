import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@ObjectType()
@Schema()
export class Cat {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => String)
  @Prop()
  name: string;

  @Field(() => String)
  @Prop()
  breed: string;

  @Field(() => String)
  @Prop()
  image?: string;
}

export type CatDocument = Cat & Document;
export const CatSchema = SchemaFactory.createForClass(Cat);
