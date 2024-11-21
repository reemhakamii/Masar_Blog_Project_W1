import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { faker } from '@faker-js/faker';

@Injectable()
export class SeedingService {
  constructor(private readonly usersService: UsersService) {}

  async seedUsers(batchSize: number) {
    const usersBatch = await Promise.all(
      Array.from({ length: batchSize }, async () => ({
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: await bcrypt.hash(faker.internet.password(), 10),
      }))
    );

    await this.usersService.createMany(usersBatch);
      console.log(`${batchSize} users have been seeded.`);
      
  }
}