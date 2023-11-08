import { Injectable, NotFoundException } from '@nestjs/common';
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
    const createUser = new this.userModel(createUserInput);
    return createUser.save();
  }

  findAllUser() {
    return this.userModel.find().exec();
  }

  findUserById(id: MongooseSchema.Types.ObjectId) {
    return this.userModel.findById(id);
  }

  updateUser(
    id: MongooseSchema.Types.ObjectId,
    updateUserInput: UpdateUserInput,
  ) {
    return this.userModel.findByIdAndUpdate(id, updateUserInput, { new: true });
  }

 async  deleteUser(id: MongooseSchema.Types.ObjectId) {
    // return this.userModel.deleteOne({ _id: id });
    try {
      const user = await this.userModel.findById(id).exec();
      // console.log(user)
      if (!user) return 'User Not Found';
      await this.userModel.findByIdAndDelete(id).exec();

      return 'Successful';
    } catch (error) {
      throw new NotFoundException('User Not Found');
    }
  }
}
