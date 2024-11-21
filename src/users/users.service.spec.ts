import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Follow } from 'src/follows/entities/follow.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
  ) {}

  async followUser(userId: string, followeeId: string) {
    if (userId === followeeId) {
      throw new Error('You cannot follow yourself.');
    }

    const follower = await this.userRepository.findOneBy({ id: userId });
    const followee = await this.userRepository.findOneBy({ id: followeeId });

    if (!follower || !followee) {
      throw new NotFoundException('User not found.');
    }

    const follow = this.followRepository.create({ follower, following: followee });
    await this.followRepository.save(follow);

    return { message: 'Followed successfully.' };
  }

  async unfollowUser(userId: string, followeeId: string) {
    const follow = await this.followRepository.findOne({
      where: { follower: { id: userId }, following: { id: followeeId } },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship not found.');
    }

    await this.followRepository.remove(follow);

    return { message: 'Unfollowed successfully.' };
  }

  async getUserProfile(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['followers', 'following'],
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      followers: user.followers.length,
      following: user.following.length,
    };
  }

  async searchByUsername(username: string) {
    const users = await this.userRepository.find({
      where: { username: username },
    });

    return users;
  }
}