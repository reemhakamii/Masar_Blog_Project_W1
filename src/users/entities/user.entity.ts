import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Article } from 'src/articles/entities/article.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Follow } from 'src/follows/entities/follow.entity';


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

  // Cascade all operations to related articles
  @OneToMany(() => Article, (article) => article.user, { cascade: true })
  articles: Article[];

  // Cascade all operations to related comments
  @OneToMany(() => Comment, comment => comment.user, { cascade: true })
  comments: Comment[];


  // Users the current user is following
  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  // Users following the current user
  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}