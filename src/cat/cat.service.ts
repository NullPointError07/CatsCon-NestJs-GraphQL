import { Injectable } from '@nestjs/common';
import { CreateCatInput } from './dto/create-cat.input';
import { join } from 'path';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { InjectModel } from '@nestjs/mongoose';
import { Cat, CatDocument } from './entities/cat.entity';
import { Model } from 'mongoose';
import { CurrentUser } from 'src/auth/dto/current-user';

// import { UpdateCatInput } from './dto/update-cat.input';

@Injectable()
export class CatService {
  constructor(
    @InjectModel(Cat.name)
    private catModel: Model<CatDocument>,
  ) {}

  async createCat(createCatInput: CreateCatInput, @CurrentUser() user: any) {
    console.log('do i get any user', user);

    const { image } = createCatInput;
    const { filename, createReadStream } = await image;
    const ReadStream = createReadStream();

    const newFilename = `${Date.now()}-${filename}`;
    const dirPath = join(process.cwd(), '/uploads');

    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }

    const writeSteam = createWriteStream(`${dirPath}/${newFilename}`);
    await ReadStream.pipe(writeSteam);

    const baseURL = process.env.BASE_URL;
    const imageURL = `${baseURL}/${newFilename}`;

    createCatInput.image = imageURL;

    // cat Data
    const catData = { ...createCatInput, creator: user._id };

    const createCat = new this.catModel(catData);
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
