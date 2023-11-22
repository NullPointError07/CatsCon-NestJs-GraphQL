import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCatInput } from './dto/create-cat.input';
import { join } from 'path';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { InjectModel } from '@nestjs/mongoose';
import { Cat, CatDocument } from './entities/cat.entity';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { UpdateCatInput } from './dto/update-cat.input';

@Injectable()
export class CatService {
  constructor(
    @InjectModel(Cat.name)
    private catModel: Model<CatDocument>,
  ) {}

  async createCat(createCatInput: CreateCatInput, userId: any) {
    const { catVideo } = createCatInput;

    const { filename, createReadStream } = await catVideo;
    const ReadStream = createReadStream();

    const newFilename = `${Date.now()}-${filename}`;
    const dirPath = join(process.cwd(), '/uploads/catVideos');

    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }

    const writeSteam = createWriteStream(`${dirPath}/${newFilename}`);
    await ReadStream.pipe(writeSteam);

    const baseURL = process.env.BASE_URL;
    const imageURL = `${baseURL}/${newFilename}`;

    createCatInput.catVideo = imageURL;
    createCatInput.creator = userId;

    const createCat = new this.catModel(createCatInput);
    return createCat.save();
  }

  findAllCat() {
    return this.catModel.find().exec();
  }

  findCatById(id: MongooseSchema.Types.ObjectId) {
    return this.catModel.findById(id);
  }

  async updateCat(
    id: MongooseSchema.Types.ObjectId,
    updateCatInput: UpdateCatInput,
  ) {
    try {
      const cat = await this.catModel.findById(id).exec();
      if (!cat) throw new NotFoundException('Cat Not Found');

      return this.catModel.findByIdAndUpdate(id, updateCatInput, {
        new: true,
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async deleteCat(id: MongooseSchema.Types.ObjectId) {
    try {
      const cat = await this.catModel.findById(id).exec();

      if (!cat) {
        throw new NotFoundException({
          message: 'Cat Not Found By cat Id',
          status: 404,
        });
      }
      await this.catModel.findByIdAndDelete(id).exec();
      return 'Sucessfully deleted Cat';
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
