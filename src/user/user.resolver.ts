import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Schema as MongooseSchema } from 'mongoose';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.createUser(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAllUser() {
    return this.userService.findAllUser();
  }

  @Query(() => User, { name: 'userById' })
  findUserById(
    @Args('userId', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return this.userService.findUserById(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.updateUser(updateUserInput._id, updateUserInput);
  }

  @Mutation(() => String,{name:"removeuserFromUserTable"})
  removeUser(
    @Args('userId', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return this.userService.deleteUser(id);
  }
}
