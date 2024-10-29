import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Res } from '@nestjs/common';
import { FileService } from './file.service';
import { Response } from 'express';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { END_POINTS } from 'src/utils/endPoints';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname, join } from 'path';
import { diskStorage } from 'multer';

@Controller(END_POINTS.FILE.BASE)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post(END_POINTS.FILE.UPLOAD)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: join(__dirname, '..', '..', '..', 'storage'),
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  upload(@UploadedFile() file: Express.Multer.File,) {
    console.log(file);
    return { message: 'File uploaded successfully', filePath: file.path };
  }

  @Get(END_POINTS.FILE.DOWNLOAD)
  download(@Param('key') key: string, @Res() res: Response) {
    const filePath = join(__dirname, '..', '..', '..', 'storage', key);
    res.header('Cache-Control', 'public, max-age=100');
    res.download(filePath);
  }
  
}
