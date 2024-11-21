import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { JwtModule } from '@nestjs/jwt';
import { User } from './users/entities/user.entity';
import { Comment } from './comments/entities/comment.entity';
import { Article } from './articles/entities/article.entity';
import { SeedingModule } from './seeding/seeding.module';
import { SeedingService } from './seeding/seeding.service';
import { FollowsModule } from './follows/follows.module';


const entities = __dirname + '/**/*.entity{.ts,.js}';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      entities: [entities],
      migrationsRun: true,
      synchronize: true,
      logging: true,
    }),
    ArticlesModule,
    UsersModule,
    AuthModule,
    CommentsModule,
    SeedingModule,
    FollowsModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedingService],
})
export class AppModule { }