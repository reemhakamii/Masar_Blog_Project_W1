import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import { Article } from 'src/articles/entities/article.entity';

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

  async create(createCommentDto: CreateCommentDto) {
    const { content, userId, articleId } = createCommentDto;

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const article = await this.articlesRepository.findOne({ where: { id: articleId } });
    if (!article) {
      throw new NotFoundException(`Article with ID ${articleId} not found`);
    }

    const comment = this.commentsRepository.create({
      content,
      user,
      article,
    });

    return this.commentsRepository.save(comment);
  }

  async findOne(id: string) {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['user', 'article'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async findAll() {
    return this.commentsRepository.find({ relations: ['user', 'article'] });
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.findOne(id);
    Object.assign(comment, updateCommentDto);
    return this.commentsRepository.save(comment);
  }

  async remove(id: string) {
    const comment = await this.findOne(id);
    return this.commentsRepository.remove(comment);
  }
}