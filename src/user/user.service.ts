import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import mongoose, { Model, Schema as MongooseSchema } from 'mongoose';
import { join } from 'path';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { UpdateProfilePictureInput } from './dto/update-user.profilePic.input';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  createUser(createUserInput: CreateUserInput) {
    try {
      const createUser = new this.userModel(createUserInput);
      return createUser.save();
    } catch (error) {
      throw new BadRequestException({
        message: 'Email Duplicated! Try another email',
        status: 404,
      });
    }
  }

  findAllUser() {
    return this.userModel.find().exec();
  }

  async findUserById(id: string) {
    const response = await this.userModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'cats',
          localField: '_id',
          foreignField: 'creator',
          as: 'userVideos',
        },
      },
      {
        $project: {
          _id: 1,
          userName: 1,
          email: 1,
          age: 1,
          address: 1,
          bio: 1,
          profilePicture: 1,
          userVideos: 1,
        },
      },
    ]);
    const user = response[0];
    return user;
  }

  findUserByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async getUserCats() {
    return await this.userModel.aggregate([
      {
        $lookup: {
          from: 'cats',
          localField: '_id',
          foreignField: 'creator',
          as: 'result',
        },
      },
    ]);
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async updateUser(
    id: MongooseSchema.Types.ObjectId,
    updateUserInput: UpdateUserInput,
  ) {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) throw new NotFoundException('User Not Found');

      return this.userModel.findByIdAndUpdate(id, updateUserInput, {
        new: true,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async updateProfilePicture(
    id: MongooseSchema.Types.ObjectId,
    updateProfilePicture: UpdateProfilePictureInput,
  ) {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) throw new NotFoundException('User Not Found');

      const { profilePicture } = updateProfilePicture;
      const { filename, createReadStream } = await profilePicture;
      const ReadStream = createReadStream();
      const newFilename = `${Date.now()}-${filename}`;
      const dirPath = join(process.cwd(), '/uploads/profilePic');

      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }

      const writeSteam = createWriteStream(`${dirPath}/${newFilename}`);
      await ReadStream.pipe(writeSteam);

      const baseURL = process.env.BASE_URL;
      const imageURL = `${baseURL}/${newFilename}`;

      updateProfilePicture.profilePicture = imageURL;

      return this.userModel.findByIdAndUpdate(id, updateProfilePicture, {
        new: true,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteUser(id: MongooseSchema.Types.ObjectId): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();

      if (!user) {
        throw new NotFoundException({
          message: 'User Not Found By Your Id',
          status: 404,
        });
      }
      return await this.userModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async deleteField(id: MongooseSchema.Types.ObjectId, fieldToDelete: string) {
    try {
      const user = await this.userModel.findById(id).exec();

      if (!user) {
        throw new NotFoundException('User Not Found');
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
