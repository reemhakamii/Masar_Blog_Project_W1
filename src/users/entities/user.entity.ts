import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Article } from 'src/articles/entities/article.entity';
import { Comment } from 'src/comments/entities/comment.entity';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Article, (article) => article.author)
    articles: Article[];


    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[];
}