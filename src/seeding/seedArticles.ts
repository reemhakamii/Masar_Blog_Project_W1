import { DataSource } from 'typeorm';
import { Article } from '../articles/entities/article.entity';
import { faker } from '@faker-js/faker';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Article],
  synchronize: true,
  logging: false,
});

const generateFakeArticles = async () => {
  await dataSource.initialize();

  const articleRepository = dataSource.getRepository(Article);

  const articles: Article[] = [];
  const BATCH_SIZE = 1000;
  const TOTAL_COUNT = 100000; 

  for (let i = 0; i < TOTAL_COUNT; i++) {
    const article = new Article();
    article.title = faker.lorem.sentence();
    article.body = faker.lorem.paragraph();
    article.createdAt = faker.date.past();
    article.userId = 'someUserId';
    articles.push(article);

    if (articles.length >= BATCH_SIZE) {
      await articleRepository.save(articles);
      console.log(`Inserted ${i + 1} articles...`);
      articles.length = 0; 
    }
  }

  if (articles.length > 0) {
    await articleRepository.save(articles);
    console.log(`Inserted ${TOTAL_COUNT} articles!`);
  }

  await dataSource.destroy();
};

generateFakeArticles().catch((error) => console.log(error));