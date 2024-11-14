import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { PaginationDto } from './dto/pagination.dto';
import { User } from 'src/users/entities/user.entity';


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
      author: user,  // Associate the article with the logged-in user
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
}
