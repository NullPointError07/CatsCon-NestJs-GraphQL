import { ObjectType, Field } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

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
