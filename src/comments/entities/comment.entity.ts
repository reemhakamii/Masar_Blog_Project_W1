import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Article } from 'src/articles/entities/article.entity';

@Index('user_article_index', ['userId', 'articleId']) 
@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.comments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  articleId: string;

  @ManyToOne(() => Article, article => article.comments)
  @JoinColumn({ name: 'articleId' })
  article: Article;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}