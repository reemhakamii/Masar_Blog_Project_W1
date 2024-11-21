import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { User } from './users/entities/user.entity';
import { Article } from './articles/entities/article.entity';
import { Comment } from './comments/entities/comment.entity';
import { faker } from '@faker-js/faker'; // Importing Faker.js
import { DataSource } from 'typeorm';


@Injectable()
export class AppService {
  constructor(
    private usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  public async generateFakeUsers(count: number): Promise<User[]> {
    const userRepository = this.dataSource.getRepository(User);
    const users = [];
    for (let i = 0; i < count; i++) {
      const user = new User();
      user.createdAt = faker.date.past();
      user.deletedAt = faker.date.future();
      user.id = faker.string.uuid();
      user.username = faker.internet.username();
      user.email = faker.internet.email();
      user.password = faker.internet.password();
      
      users.push(user);
    }

    return await userRepository.save(users);
  }

  public async generateFakeArticlesForAllUsers(count: number): Promise<Article[]> {
    const usersRepository = this.dataSource.getRepository(User);
    const articlesRepository = this.dataSource.getRepository(Article);

    const users = await usersRepository.find();
    const allPosts: Article[] = [];

    for (const user of users) {
      for (let i = 0; i < count; i++) {
        const post = articlesRepository.create({
          title: faker.lorem.sentence(),
          body: faker.lorem.paragraph(),
          userId: user.id,
          createdAt: faker.date.past(),
          updatedAt: faker.date.future(),
        });
        allPosts.push(await articlesRepository.save(post));
      }
    }

    return allPosts;
  }
}
