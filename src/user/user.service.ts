import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model, Schema as MongooseSchema } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  createUser(createUserInput: CreateUserInput) {
    console.log('checking create user', createUserInput);
    const createUser = new this.userModel(createUserInput);

    return createUser.save();
  }

  findAll() {
    return `This action returns all user`;
  }

  getUserById(id: MongooseSchema.Types.ObjectId) {
    return this.userModel.findById(id);
  }

  updateUser(
    id: MongooseSchema.Types.ObjectId,
    updateUserInput: UpdateUserInput,
  ) {
    return this.userModel.findByIdAndUpdate(id, updateUserInput, { new: true });
  }

  deleteUser(id: MongooseSchema.Types.ObjectId) {
    return this.userModel.deleteOne({ _id: id });
  }
}
