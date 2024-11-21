import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import { Article } from 'src/articles/entities/article.entity';
import { faker } from '@faker-js/faker';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  // Create a new comment
  async create(createCommentDto: CreateCommentDto) {
    const { content, userId, articleId } = createCommentDto;
  
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const article = await this.articlesRepository.findOne({ where: { id: articleId } });
  
    if (!user || !article) {
      throw new NotFoundException('Unable to find the associated user or article');
    }
  
    const comment = this.commentsRepository.create({
      content,
      user,
      article,
    });
  
    return this.commentsRepository.save(comment);
  }




  async fillCommentsToReachMillion() {
    const currentCount = await this.commentsRepository.count();
    const targetCount = 1_000_000;
    const remainingCount = targetCount - currentCount;
  
    if (remainingCount <= 0) {
      console.log('Comments table already has 1 million or more entries.');
      return;
    }
  
    const chunkSize = 10_000;
    const comments = [];
    const userIds = (await this.usersRepository.find()).map(user => user.id);
    const articleIds = (await this.articlesRepository.find()).map(article => article.id);
  
    for (let i = 0; i < remainingCount; i++) {
      const randomContent = faker.lorem.sentence();
      const randomUserId = faker.helpers.arrayElement(userIds);
      const randomArticleId = faker.helpers.arrayElement(articleIds);
  
      comments.push({
        content: randomContent,
        userId: randomUserId,
        articleId: randomArticleId,
      });
  
      if (comments.length === chunkSize) {
        console.log(`Inserting ${chunkSize} comments...`);
        await this.commentsRepository.insert(comments);
        comments.length = 0;
      }
    }
  
    if (comments.length > 0) {
      console.log('Inserting remaining comments...');
      await this.commentsRepository.insert(comments);
    }
  
    console.log('Finished filling comments to 1 million.');
  }



  // Find a single comment by ID
async findOne(id: string): Promise<Comment> {
  const comment = await this.commentsRepository.findOne({
    where: { id: id as string },  // Ensure this matches the expected type
    relations: ['user', 'article'],
  });


    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  // Find all comments with pagination support
  async findAll(page: number = 1, limit: number = 10): Promise<Comment[]> {
    const skip = (page - 1) * limit;
    return this.commentsRepository.find({
      where: { deletedAt: null }, // Exclude soft-deleted comments
      relations: ['user', 'article'],
      skip,
      take: limit,
    });
  }

  // Update a comment by ID
  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.findOne(id);

    // If updateCommentDto is empty, throw an error
    if (!Object.keys(updateCommentDto).length) {
      throw new BadRequestException('No fields to update');
    }

    Object.assign(comment, updateCommentDto);
    return this.commentsRepository.save(comment);
  }

  // Soft delete a comment (set deletedAt to current date)
  async remove(id: string): Promise<Comment> {
    const comment = await this.findOne(id);
    comment.deletedAt = new Date();
    return this.commentsRepository.save(comment);
  }
}