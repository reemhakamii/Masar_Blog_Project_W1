import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Post()
  async addNewUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.addNewUser(createUserDto);
  }

  @Get(':id')
  async getUserProfile(@Param('id') id: string) {
    return this.usersService.getUserProfile(id);
  }

  @Post(':id/follow/:followingId')
  async followUser(
    @Param('id') followerId: string,
    @Param('followingId') followingId: string,
  ) {
    await this.usersService.followUser(followerId, followingId);
    return { message: 'Followed successfully' };
  }

  @Post(':id/unfollow/:followingId')
  async unfollowUser(
    @Param('id') followerId: string,
    @Param('followingId') followingId: string,
  ) {
    await this.usersService.unfollowUser(followerId, followingId);
    return { message: 'Unfollowed successfully' };
  }

  @Post('search')
  async searchByUsername(@Query('username') username: string) {
    return this.usersService.searchByUsername(username);
  }
}