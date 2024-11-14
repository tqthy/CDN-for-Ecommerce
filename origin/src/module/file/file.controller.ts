import { Controller, Get, Param, Res, Query } from '@nestjs/common';
import { FileService } from './file.service';
import { Response } from 'express';
import { END_POINTS } from 'src/utils/endPoints';
import { join } from 'path';
import { ResponseObject } from 'src/utils/responseObject';

@Controller(END_POINTS.FILE.BASE)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(END_POINTS.FILE.UPLOAD)
  async getPreSignedUrl(@Query('contentType') contentType: string) {
    console.log(contentType);
    const res = await this.fileService.generatePreSignedUrl(contentType);
    return ResponseObject.create('Pre-signed URL generated', res);
  }

  @Get(END_POINTS.FILE.DOWNLOAD)
  async download(@Param('key') key: string, @Res() res: Response) {
    const filePath = join(__dirname, '..', '..', '..', 'storage', key);
    res.header('CDN-Cache-Control', 'public, max-age=100');
    await this.fileService.get(key, filePath);
    
    res.download(filePath);
  }
}
  
  



