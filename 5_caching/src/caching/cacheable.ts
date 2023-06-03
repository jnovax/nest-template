import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PROPERTY_DEPS_METADATA } from '@nestjs/common/constants';
import { CACHE_KEY_METADATA, CACHE_MANAGER, CACHE_TTL_METADATA } from '@nestjs/cache-manager';

export const Cacheable = (target: object, propertyKey: string, descriptor: PropertyDescriptor): void => {
  const injections: { key: string; type: string }[] =
    Reflect.getMetadata(PROPERTY_DEPS_METADATA, target.constructor) || [];
  if (!injections.some((injection) => injection.type === CACHE_MANAGER)) {
    const injector = Inject(CACHE_MANAGER);
    injector(target, CACHE_MANAGER);
  }
  const originalMethod = descriptor.value;
  descriptor.value = async function (...args: unknown[]): Promise<unknown> {
    const cacheKeyPrefix =
      Reflect.getMetadata(CACHE_KEY_METADATA, descriptor.value) ||
      Reflect.getMetadata(CACHE_KEY_METADATA, originalMethod) ||
      `${target.constructor.name}:${originalMethod.name}`;
    const ttl =
      Reflect.getMetadata(CACHE_TTL_METADATA, descriptor.value) ||
      Reflect.getMetadata(CACHE_TTL_METADATA, originalMethod) ||
      1000;
    const cacheKey = [cacheKeyPrefix, args.map((arg) => JSON.stringify(arg)).join('_')].filter((v) => v).join('_');
    const cacheManager = (this as { [CACHE_MANAGER]: Cache })[CACHE_MANAGER];
    const cachedData = await cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    const result = await originalMethod.apply(this, args);
    await cacheManager.set(cacheKey, result, ttl);

    return result;
  };
};