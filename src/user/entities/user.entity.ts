import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Cat } from 'src/cat/entities/cat.entity';

@ObjectType()
@Schema()
export class User {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Field(() => String)
  @Prop()
  userName: string;

  @Field(() => String)
  @Prop({ unique: true })
  email: string;

  @Field(() => String)
  @Prop()
  password: string;

  // @Field(() => String)
  // @Prop()
  // confirmPassword: string;

  @Field(() => Int)
  @Prop()
  age: number;

  @Field(() => String)
  @Prop()
  address: string;

  @Field(() => String)
  @Prop()
  bio: string;

  @Field(() => String)
  @Prop()
  profilePicture?: string;

  @Field(() => [Cat])
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Cat' }] })
  cats: Cat[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
