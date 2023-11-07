import { Injectable } from '@nestjs/common';
import { CreateCatInput } from './dto/create-cat.input';
import { join } from 'path';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { InjectModel } from '@nestjs/mongoose';
import { Cat, CatDocument } from './entities/cat.entity';
import { Model } from 'mongoose';

// import { UpdateCatInput } from './dto/update-cat.input';

@Injectable()
export class CatService {
  constructor(
    @InjectModel(Cat.name)
    private catModel: Model<CatDocument>,
  ) {}

  async createCat(createCatInput: CreateCatInput) {
    const { image } = createCatInput;

    const { filename, createReadStream } = await image;

    const ReadStream = createReadStream();
    // console.log('what is read stream', ReadStream);

    const newFilename = `${Date.now()}-${filename}`;
    // console.log('new file name', newFilename);

    const dirPath = join(process.cwd(), 'uploads');
    // console.log('directory path', dirPath);

    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }

    const writeSteam = createWriteStream(`${dirPath}/${newFilename}`);
    // console.log('what is write stream', writeSteam);

    await ReadStream.pipe(writeSteam);

    const baseURL = process.env.BASE_URL;

    const imageURL = `${baseURL}/${newFilename}`;

    createCatInput.image = imageURL;

    console.log('image string ', createCatInput);

    const createCat = new this.catModel(createCatInput);
    return createCat.save();
  }

  findAll() {
    return `This action returns all cat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cat`;
  }

  // update(id: number, updateCatInput: UpdateCatInput) {
  //   return `This action updates a #${id} cat`;
  // }

  remove(id: number) {
    return `This action removes a #${id} cat`;
  }
}
