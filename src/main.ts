import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { SeedingService } from './seeding/seeding.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const seedingService = app.get(SeedingService);
  app.enableCors();
  const port = configService.get<number>('PORT') || 3339;

  await seedingService.seedUsers(10000);

  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();