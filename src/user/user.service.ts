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

  async updateUser(
    id: MongooseSchema.Types.ObjectId,
    updateUserInput: UpdateUserInput,
  ) {
    try {
      const user = await this.userModel.findById(id).exec();
      console.log(user);

      // const deleteAdrees = user.address;
      // console.log(deleteAdrees);

      // delete user.address

      if (!user) throw new NotFoundException('User Not Found');
      return this.userModel.findByIdAndUpdate(id, updateUserInput, {
        new: true,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteUser(id: MongooseSchema.Types.ObjectId) {
    try {
      const user = await this.userModel.findById(id).exec();

      if (!user) return 'User Not Found';
      await this.userModel.findByIdAndDelete(id).exec();

      return 'Successfully deleted user';
    } catch (error) {
      throw new NotFoundException('User Not Found');
    }
  }

  async deleteOneField(
    id: MongooseSchema.Types.ObjectId,
    fieldToDelete: string,
  ) {
    try {
      const user = await this.userModel.findById(id).exec();

      if (!user) {
        return 'User Not Found';
      }

      if (user[fieldToDelete] !== undefined) {
        const updateQuery = { $unset: { [fieldToDelete]: 1 } };

        await this.userModel
          .findByIdAndUpdate(id, updateQuery, { new: true })
          .exec();
        return `Successfully deleted ${fieldToDelete} from user`;
      } else {
        return `${fieldToDelete} not found in user`;
      }
    } catch (error) {
      throw new NotFoundException('User Not Found');
    }
  }
}
