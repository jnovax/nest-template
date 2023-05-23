import { Injectable } from '@nestjs/common';
import { HelloDto } from './app.dto';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hi!';
  }

  postHello(model: HelloDto): string {
    return `Hello ${model.name}!`;
  }
}
