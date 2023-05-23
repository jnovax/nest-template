import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { contentParser } from 'fastify-multer';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import helmet from '@fastify/helmet'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });
  await app.register(contentParser);

  const swaggerDocument = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API')
    .setVersion('1.0')
    .addTag('API')
    .build();
  SwaggerModule.setup(
    'api',
    app,
    SwaggerModule.createDocument(app, swaggerDocument),
  );

  await app.listen(3000);
  
  console.log(`APP IS RUNNING ON PORT ${await app.getUrl()}`);
}
bootstrap();
