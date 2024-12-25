import { Controller, Get, Param, Res, Query, Post, HttpException } from '@nestjs/common';
import { FileService } from './file.service';
import { Response } from 'express';
import { END_POINTS } from 'src/utils/endPoints';
import { join } from 'path';
import * as fs from 'fs';
import { ResponseObject } from 'src/utils/responseObject';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { GetPresignedUrlDto } from './dto/get-presigned-url.dto';
import * as sharp from 'sharp';
import sizeOf from 'image-size';

@Controller(END_POINTS.FILE.BASE)
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService) {}

  @Get(END_POINTS.FILE.UPLOAD)
  async getPreSignedUrl(@Query() getPresignedUrlDto: GetPresignedUrlDto) {
    const res = await this.fileService.generatePreSignedUrl(getPresignedUrlDto.contentType, getPresignedUrlDto.fileName);
    return ResponseObject.create('Pre-signed URL generated', res);
  }

  @Get(END_POINTS.FILE.DOWNLOAD)
  async download(
    @Param('key') key: string,
    @Query('w') width: string, 
    @Res() res: Response
  ) {
    try {
      const filePath = join(__dirname, '..', '..', '..', 'storage', key);
      const objectMetadata = await this.fileService.getMetadata(key);

      res.header('CDN-Cache-Control', `max-age=${objectMetadata['cache-max-age']}`);
      if (fs.existsSync(filePath)) {
        if (width) {
          const parsedWidth = parseInt(width, 10); 
          if (isNaN(parsedWidth) || parsedWidth <= 0) {
            throw new Error(`Expected positive integer for width but received ${width}`);
          }

          const dimensions = sizeOf(filePath);
          console.log('Dimensions:', dimensions);
          if (parsedWidth >= dimensions.width) {
            res.download(filePath);
            return;
          }

          let newKey = '';
          const parts = key.split('.');
          if (parts.length === 2) {
            newKey = `${parts[0]}-${parsedWidth}w.${parts[1]}`;
          }
          const newFilePath = join(__dirname, '..', '..', '..', 'storage', newKey);

          if (fs.existsSync(newFilePath)) {
            res.download(newFilePath);
            return;
          } else {
            await sharp(filePath).resize(parsedWidth).toFile(newFilePath);
            res.download(newFilePath);
          }
        } else {
          res.download(filePath);
        }
        return;
      } else {
        await this.fileService.get(key, filePath);
        if (width) {
          const parsedWidth = parseInt(width, 10); 
          if (isNaN(parsedWidth) || parsedWidth <= 0) {
            throw new Error(`Expected positive integer for width but received ${width}`);
          }

          const dimensions = sizeOf(filePath);
          console.log('Dimensions:', dimensions);
          if (parsedWidth >= dimensions.width) {
            res.download(filePath);
            return;
          }

          let newKey = '';
          const parts = key.split('.');
          if (parts.length === 2) {
            newKey = `${parts[0]}-${parsedWidth}w.${parts[1]}`;
          }
          const newFilePath = join(__dirname, '..', '..', '..', 'storage', newKey);
          await sharp(filePath).resize(parsedWidth).toFile(newFilePath);
          res.download(newFilePath);
        } else {
          res.download(filePath);
        }
      }

    } catch (error) {
      console.error('Error downloading file:', error);
      return new HttpException('Error downloading file', 500);
    }
  }

  @Post(END_POINTS.FILE.PURGE)
  async purge(@Param('key') key: string) {
    await this.redisService.publish(this.configService.get<string>('REDIS_CHANNEL'), JSON.stringify({ action: 'purge', key }));
    return ResponseObject.create('Purge request sent');
  }
}
  
  



