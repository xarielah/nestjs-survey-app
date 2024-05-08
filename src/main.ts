import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: false }));
  app.use(cookieParser());
  const dbUri = process.env.MONGO_URI || '';
  if (!dbUri) throw Error('Mongo URI not found');
  await mongoose.connect(dbUri);
  await app.listen(3000);
}
bootstrap();
