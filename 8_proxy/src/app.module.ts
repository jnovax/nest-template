import { Module } from '@nestjs/common';
import { ProxyModule } from './proxy/proxy.module';
import { HelloModule } from './hello/hello.module';

@Module({
  imports: [ProxyModule, HelloModule],
})
export class AppModule { }
