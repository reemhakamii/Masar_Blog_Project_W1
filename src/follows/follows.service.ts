import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow) private followRepository: Repository<Follow>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async followUser(followerId: string, followingId: string) { 
    const follower = await this.userRepository.findOneBy({ id: followerId });
    const following = await this.userRepository.findOneBy({ id: followingId }); 

    if (!follower || !following) {
      throw new Error('Follower or Following user does not exist'); 
    }

    const follow = this.followRepository.create({
      follower,
      following,
    });

    return this.followRepository.save(follow);
  }

  async unfollowUser(followerId: string, followingId: string) { 
    const follow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } }, 
    });

    if (!follow) {
      throw new Error('Follow relationship does not exist');
    }

    return this.followRepository.remove(follow);
  }

  async getFollowers(userId: string) {
    return this.followRepository.find({
      where: { following: { id: userId } },
      relations: ['follower'],
    });
  }

  async getFollowing(userId: string) {
    return this.followRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'], 
    });
  }
}