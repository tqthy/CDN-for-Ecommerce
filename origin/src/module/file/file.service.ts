import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FileService {
  get(key: string) {
    throw new Error('Method not implemented.');
  }
  upload(createFileDto: CreateFileDto) {
    throw new Error('Method not implemented.');
  }
}
