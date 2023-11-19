import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
// import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Schema as MongooseSchema } from 'mongoose';
import { extname } from 'path';
// import { UsePipes, ValidationPipe } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // @Mutation(() => User)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.userService.createUser(createUserInput);
  // }

  @Query(() => [User], { name: 'usersAll' })
  findAllUser() {
    return this.userService.findAllUser();
  }

  @Query(() => User, { name: 'userById' })
  findUserById(
    @Args('userId', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return this.userService.findUserById(id);
  }

  // update user
  @Mutation(() => User, { name: 'updateUserFromUserDoc' })
  // @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    if (updateUserInput.profilePicture) {
      const { createReadStream, filename } = updateUserInput.profilePicture;
      const fileExt = extname(filename);

      console.log('flexExt...', fileExt);

      if (!['.jpg', '.jpeg', '.png'].includes(fileExt)) {
        throw new Error(
          'Invalid file format. Only JPEG, JPG, and PNG are allowed..',
        );
      }

      const maxSize = 3 * 1024 * 1024; // 3MB
      if (createReadStream().length > maxSize) {
        throw new Error('File size exceeds the allowed limit of 3MB.');
      }
    }

    return this.userService.updateUser(updateUserInput._id, updateUserInput);
  }

  // delete user
  @Mutation(() => User, { name: 'deleteUserFromUserDoc' })
  async deleteUser(
    @Args('userId', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ): Promise<User> {
    return await this.userService.deleteUser(id);
  }

  @Mutation(() => String, { name: 'deleteFieldFromUserDoc' })
  async deleteField(
    @Args('userId', { type: () => String }) id: MongooseSchema.Types.ObjectId,
    @Args('fieldToDelete') fieldToDelete: string,
  ) {
    try {
      const result = await this.userService.deleteField(id, fieldToDelete);
      return result;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to delete field');
    }
  }
}
