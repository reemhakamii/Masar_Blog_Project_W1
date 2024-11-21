import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Follow } from 'src/follows/entities/follow.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async addNewUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async updateUser(updateUserDto: UpdateUserDto, id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    await this.userRepository.delete(id);
  }

  async getUserProfile(userId: string): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: { id: userId },
      relations: ['followers', 'following'],
    });
  }

  async followUser(followerId: string, followingId: string): Promise<void> {
    const follower = await this.userRepository.findOne({ where: { id: followerId } });
    const following = await this.userRepository.findOne({ where: { id: followingId } });

    if (!follower || !following) {
      throw new Error('User(s) not found');
    }

    const follow = this.followRepository.create({ follower, following });
    await this.followRepository.save(follow);
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    const follower = await this.userRepository.findOne({ where: { id: followerId } });
    const following = await this.userRepository.findOne({ where: { id: followingId } });

    if (!follower || !following) {
      throw new Error('User(s) not found');
    }

    await this.followRepository.delete({ follower, following });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createMany(users: CreateUserDto[]): Promise<User[]> {
    const usersToCreate = this.userRepository.create(users);
    return this.userRepository.save(usersToCreate);
  }

  async searchByUsername(username: string): Promise<User[]> {
    return this.userRepository.find({
      where: { username: Like(`%${username}%`) },
    });
  }
}