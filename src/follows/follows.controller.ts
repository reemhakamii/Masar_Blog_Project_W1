import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { FollowsService } from './follows.service';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post()
  async followUser(
    @Body('followerId') followerId: string,
    @Body('followingId') followingId: string,
  ) {
    return this.followsService.followUser(followerId, followingId);
  }

  @Delete()
  async unfollowUser(
    @Body('followerId') followerId: string,
    @Body('followingId') followingId: string, 
  ) {
    return this.followsService.unfollowUser(followerId, followingId);
  }

  @Get(':userId/followers')
  async getFollowers(@Param('userId') userId: string) {
    return this.followsService.getFollowers(userId);
  }

  @Get(':userId/following')
  async getFollowing(@Param('userId') userId: string) {
    return this.followsService.getFollowing(userId);
  }
}