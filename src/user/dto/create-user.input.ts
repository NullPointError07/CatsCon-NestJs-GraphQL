import { InputType, Int, Field } from '@nestjs/graphql';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsImageFile(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isImageFile',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const file = args.object[propertyName];

          if (!file || !file.filename) {
            return false; // Reject if file or filename is undefined or null
          }

          const allowedFormats = ['.jpg', '.jpeg', '.png'];
          const isValidFormat = allowedFormats.some((format) =>
            file.filename.toLowerCase().endsWith(format),
          );

          if (!isValidFormat) {
            return false;
          }

          const maxSize = 3 * 1024 * 1024; // 3MB
          if (file.createReadStream().length > maxSize) {
            return false;
          }

          return true;
        },
      },
    });
  };
}

@InputType()
export class CreateUserInput {
  @Field(() => String)
  userName: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  // @Field(() => String)
  // confirmPassword: string;

  @Field(() => Int, { nullable: true })
  age: number;

  @Field(() => String, { nullable: true })
  address: string;

  @Field(() => String, { nullable: true })
  bio: string;

  @Field(() => GraphQLUpload, { nullable: true })
  @IsImageFile({ message: 'Invalid file format or size' })
  profilePicture?: Upload;
}
