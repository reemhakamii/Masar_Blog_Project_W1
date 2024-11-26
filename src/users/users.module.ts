import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Follow } from 'src/follows/entities/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follow]),
    JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1h' },
  }),],
  controllers: [UsersController],
  providers: [UsersService,],
  exports: [UsersService,],
})
export class UsersModule {}