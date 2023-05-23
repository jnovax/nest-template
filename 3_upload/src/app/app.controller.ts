import { Body, Controller, Get, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { HelloDto, MultipleFileDto, SingleFileDto } from './app.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FastifyFileInterceptor, FastifyFilesInterceptor } from '../fastify-upload/fastify-upload.interceptor';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './app.util';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  postHello(@Body() data: HelloDto): string {
    return this.appService.postHello(data);
  }

  @ApiConsumes('multipart/form-data')
  @Post('single-file')
  @UseInterceptors(
    FastifyFileInterceptor('photo_url', {
      storage: diskStorage({
        destination: './upload',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  single(@UploadedFile() file: Express.Multer.File, @Body() body: SingleFileDto) {
    return { ...body, photo_url: file.path };
  }

  @ApiConsumes('multipart/form-data')
  @Post('multiple-file')
  @UseInterceptors(
    FastifyFilesInterceptor('photo_url', 10, {
      storage: diskStorage({
        destination: './upload',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  multiple(@UploadedFiles() files: Express.Multer.File[], @Body() body: MultipleFileDto) {
    return { ...body, photo_urls: files.map(x => x.path) };
  }
}
