import { Controller, Get, Param, Res, Query, Post } from '@nestjs/common';
import { FileService } from './file.service';
import { Response } from 'express';
import { END_POINTS } from 'src/utils/endPoints';
import { join } from 'path';
import { ResponseObject } from 'src/utils/responseObject';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Controller(END_POINTS.FILE.BASE)
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService) {}

  @Get(END_POINTS.FILE.UPLOAD)
  async getPreSignedUrl(@Query('contentType') contentType: string) {
    console.log(contentType);
    const res = await this.fileService.generatePreSignedUrl(contentType);
    return ResponseObject.create('Pre-signed URL generated', res);
  }

  @Get(END_POINTS.FILE.DOWNLOAD)
  async download(@Param('key') key: string, @Res() res: Response) {
    const filePath = join(__dirname, '..', '..', '..', 'storage', key);
    
    const object = await this.fileService.get(key, filePath);
    console.log(object);
    res.header('CDN-Cache-Control', `public, max-age=${object.metaData['cache-max-age']}`);
  

    res.download(filePath);
  }

  @Post(END_POINTS.FILE.PURGE)
  async purge(@Param('key') key: string) {
    await this.redisService.publish(this.configService.get<string>('REDIS_CHANNEL'), JSON.stringify({ action: 'purge', key }));
    return ResponseObject.create('Purge request sent');
  }
}
  
  



