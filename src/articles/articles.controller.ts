import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, HttpStatus, HttpCode, Request, Put } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { DataSource } from 'typeorm'; 
import { faker } from '@faker-js/faker';
import { Article } from './entities/article.entity';
import { PaginationDto } from './dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly dataSource: DataSource, 
  ) { }

  @Get()
  async getPaginatedArticles(
    @Query() paginationDto: PaginationDto,
  ) {
    const { page = 1, limit = 10, searchTerm } = paginationDto;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
  
    const articles = await this.articlesService.findPaginatedArticles({
      page: pageNumber,
      limit: limitNumber,
      searchTerm,
    });
    return articles;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createArticle(
    @Body() createArticleDto: CreateArticleDto,
    @Request() req,
  ) {
    const userId = req.user.id; 
    return this.articlesService.create(createArticleDto, userId);
  }

  @Get()
  findAll() {
    return this.articlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }

  @Post('/fillArticles')
  async fillArticles() {
    const articlesRepo = this.dataSource.getRepository(Article);
    const articles = Array.from({ length: 1000 }, () => ({
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
    }));
    await articlesRepo.save(articles);

    return 'Articles populated successfully!';
  }
  @Put(':id')
@UseGuards(JwtAuthGuard)
async updateArticle(
  @Param('id') id: string, 
  @Body() updateArticleDto: UpdateArticleDto,
  @Request() req: any
) {
  const userId = req.user.id;
  return this.articlesService.updateArticle(id, userId, updateArticleDto);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteArticle(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;
    return this.articlesService.deleteArticle(id, userId);
  }
}