import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCatInput } from './dto/create-cat.input';
// import { UpdateCatInput } from './dto/update-cat.input';
import { join } from 'path';
import { createWriteStream } from 'fs';

@Injectable()
export class CatsService {
  async createCat({ name, breed, image }: CreateCatInput) {
    console.log('imagesss', image);

    const { createReadStream, filename } = await image;
    return new Promise(async (resolve) => {
      createReadStream()
        .pipe(
          createWriteStream(
            join(process.cwd(), `./src/uploads/${Date.now() + filename}`),
          ),
        )
        .on('finish', () =>
          resolve({
            name,
            breed,
            image: filename,
          }),
        )
        .on('error', () => {
          new HttpException('Could not save image', HttpStatus.BAD_REQUEST);
        });
    });
  }

  findAll() {
    return `This action returns all cats`;
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
