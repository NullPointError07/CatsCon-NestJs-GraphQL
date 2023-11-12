import { CreateUserInput } from './create-user.input';
import { InputType, Field, OmitType, PartialType } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';

@InputType()
export class UpdateUserInput extends PartialType(
  OmitType(CreateUserInput, ['password', 'confirmPassword', 'email']),
) {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;
}
