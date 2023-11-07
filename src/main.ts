import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors();
  app.use('/graphql', graphqlUploadExpress({ maxFileSize: 100000000000 }));
  console.log('http://localhost:3001/graphql');
  await app.listen(3001);
}
bootstrap();
