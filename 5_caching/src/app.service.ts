import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { Cacheable } from './caching/cacheable';
import { CacheTTL } from '@nestjs/cache-manager';

@Injectable()
export class AppService {
  private readonly redis: Redis;

  constructor(
    private readonly config: ConfigService,
  ) {
    this.redis = new Redis({
      host: config.get('REDIS_HOST') || '127.0.0.1',
      port: this.config.get('REDIS_PORT') || 6379,
      password: config.get('REDIS_PASSWORD') || undefined,
      db: 2,
    });
  }

  @Cacheable
  @CacheTTL(1000)
  async getHello(): Promise<string> {
    const newValue = await this.redis.incr('hello-counter')
    return `Hello World! ${newValue}`;
  }
}
