import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ReadStream } from 'fs';
import { validateFileFormat, validateFileSize } from 'src/utils/file.utils';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(
    private readonly allowedFormats: string[],
    private readonly maxFileSize: number,
    private readonly fileType: string,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: any, metadata: ArgumentMetadata) {
    const resolvedValue = await Promise.resolve(value);
    const resolvedData = await resolvedValue?.[this.fileType];

    console.log('resolved data', resolvedData);

    if (resolvedData) {
      const { filename, createReadStream } = resolvedData;

      const fileStream = createReadStream() as ReadStream;

      const isFileFormatValid = validateFileFormat(
        filename,
        this.allowedFormats,
      );

      if (!isFileFormatValid)
        throw new Error(`${this.fileType} format not valid`);

      const isFileSizeValid = await validateFileSize(
        fileStream,
        this.maxFileSize,
      );

      if (!isFileSizeValid) throw new Error(`${this.fileType} size not valid`);
    }

    return value;
  }
}
