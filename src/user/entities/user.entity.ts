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

  @Field(() => Int, { nullable: true })
  @Prop({ nullable: true, default: null })
  age: number;

  @Field(() => String, { description: 'user address', nullable: true })
  @Prop({ nullable: true })
  address: string;

  @Field(() => String, { description: 'user bio', nullable: true })
  @Prop({ nullable: true })
  bio: string;

  @Field(() => String, {
    description: 'this is user profile picture',
    nullable: true,
  })
  @Prop({ default: null })
  profilePicture?: string;

  @Field(() => [Cat], { description: 'cat', nullable: true })
  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Cat',
    nullable: true,
  })
  userVideos: Cat[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
