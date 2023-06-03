import { Controller, Get, Header, StreamableFile } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/download')
  @Header('Content-Type', 'application/octet-stream')
  @Header('Content-Disposition', 'attachment; filename="report.xlsx"')
  async getFile(): Promise<StreamableFile> {
    const buffer = await this.appService.getReport();
    return new StreamableFile(new Uint8Array(buffer));
  }
}
