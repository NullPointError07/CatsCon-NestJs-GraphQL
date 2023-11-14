import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
@Schema()
export class Cat {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => User)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  creator: MongooseSchema.Types.ObjectId | User;

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
