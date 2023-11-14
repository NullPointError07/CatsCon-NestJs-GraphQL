import { Injectable } from '@nestjs/common';
import { CreateCatInput } from './dto/create-cat.input';
import { join } from 'path';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { InjectModel } from '@nestjs/mongoose';
import { Cat, CatDocument } from './entities/cat.entity';
import { Model, Schema as MongooseSchema } from 'mongoose';
// import { CurrentUser } from 'src/auth/dto/current-user';

// import { UpdateCatInput } from './dto/update-cat.input';

@Injectable()
export class CatService {
  constructor(
    @InjectModel(Cat.name)
    private catModel: Model<CatDocument>,
  ) {}

  // @CurrentUser() user: any
  async createCat(createCatInput: CreateCatInput) {
    // console.log('do i get any user', user);

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
    // const catData = { ...createCatInput, creator: user.id };

    const createCat = new this.catModel(createCatInput);
    return createCat.save();
  }

  findAll() {
    return `This action returns all cat`;
  }

  findCatById(id: MongooseSchema.Types.ObjectId) {
    return this.catModel.findById(id);
  }

  // update(id: number, updateCatInput: UpdateCatInput) {
  //   return `This action updates a #${id} cat`;
  // }

  remove(id: number) {
    return `This action removes a #${id} cat`;
  }
}
