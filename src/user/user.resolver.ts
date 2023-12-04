import { UsePipes } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
// import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UpdateProfilePictureInput } from './dto/update-user.profilePic.input';
import { Schema as MongooseSchema } from 'mongoose';
import { FileValidationPipe } from 'src/pipes/file-validation.pipe';

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

  @Query(() => User, { name: 'userByEmail' })
  findUserByEmail(
    @Args('userEmail', { type: () => String }) email: string,
  ) {
    return this.userService.findUserByEmail(email);
  }
  
  // update user
  @Mutation(() => User, { name: 'updateUserFromUserDoc' })
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.updateUser(updateUserInput._id, updateUserInput);
  }

  @Mutation(() => User, { name: 'updateUserProfilePicture' })
  @UsePipes(
    new FileValidationPipe(
      ['png', 'jpg', 'jpeg'],
      2 * 1024 * 1024, // 2MB
      'profilePicture',
    ),
  )
  updateUserProfilePicture(
    @Args('updateProfilePicture')
    updateProfilePicture: UpdateProfilePictureInput,
  ) {
    return this.userService.updateProfilePicture(
      updateProfilePicture._id,
      updateProfilePicture,
    );
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
