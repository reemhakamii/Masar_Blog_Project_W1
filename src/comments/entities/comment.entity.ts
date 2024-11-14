import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Article } from 'src/articles/entities/article.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User, (user) => user.comments, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Article, (article) => article.comments, { eager: true, onDelete: 'CASCADE' })
  article: Article;
}