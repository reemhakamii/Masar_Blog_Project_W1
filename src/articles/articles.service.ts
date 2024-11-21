import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { PaginationDto } from './dto/pagination.dto';
import { User } from 'src/users/entities/user.entity';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findPaginatedArticles(paginationDto: PaginationDto) {
    const { page, limit, searchTerm } = paginationDto;

    const queryBuilder = this.articleRepository.createQueryBuilder('article');

    if (searchTerm) {
      queryBuilder.where(
        'article.title LIKE :searchTerm OR article.body LIKE :searchTerm',
        { searchTerm: `%${searchTerm}%` },
      );
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [articles, total] = await queryBuilder.getManyAndCount();

    return {
      data: articles,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(createArticleDto: CreateArticleDto, user: any) {
    const article = this.articleRepository.create({
      ...createArticleDto,
      user: user,
    });
    return this.articleRepository.save(article);
  }

  findAll() {
    return `This action returns all articles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }

  async fillArticlesToReachMillion() {
    const currentCount = await this.articleRepository.count();
    const targetCount = 1_000_000;
    const remainingCount = targetCount - currentCount;
  
    if (remainingCount <= 0) {
      console.log('Articles table already has 1 million or more entries.');
      return;
    }
  
    const chunkSize = 10_000;
    const articles = [];
    const userIds = (await this.userRepository.find()).map(user => user.id);
  
    for (let i = 0; i < remainingCount; i++) {
      const randomTitle = faker.lorem.sentence();
      const randomBody = faker.lorem.paragraphs();
      const randomAuthorId = faker.helpers.arrayElement(userIds); 
  
      articles.push({
        id: uuidv4(),
        title: randomTitle,
        body: randomBody,
        authorId: randomAuthorId,
      });
  
      if (articles.length === chunkSize) {
        console.log(`Inserting ${chunkSize} articles...`);
        await this.articleRepository.insert(articles);
        articles.length = 0;
      }
    }
  
    if (articles.length > 0) {
      console.log('Inserting remaining articles...');
      await this.articleRepository.insert(articles);
    }
  
    console.log('Finished filling articles to 1 million.');
  }
  async updateArticle(
    id: string,
    userId: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const article = await this.articleRepository.findOne({ where: { id, userId } });
  
    if (!article) {
      throw new Error('Article not found or you are not authorized to edit it');
    }
  
    Object.assign(article, updateArticleDto);
    return this.articleRepository.save(article);
  }

  async deleteArticle(id: string, userId: string) {
    const article = await this.articleRepository.findOne({ where: { id, userId } });
  
    if (!article) {
      throw new Error('Article not found or you are not authorized to delete it');
    }
  
    await this.articleRepository.remove(article);
    return { message: 'Article deleted successfully' };
  }
}