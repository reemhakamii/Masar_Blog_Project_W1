import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationPipe } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  @Get('/getUsers')
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Post('/addUser')
  addNewUser(@Body(ValidationPipe) data: CreateUserDto) {
    return this.usersService.addNewUser(data);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateUserDto, id);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

@Post('/login')
async login(@Body() body: { email: string, password: string }) {
  const { email, password } = body;
  console.log('Login Attempt:', { email, password });
  const { token } = await this.usersService.login(email, password);
  return { token };
}


  @Post('/fillUsers')
  async fillUsers() {
    const userRepository = this.dataSource.getRepository(User);
    const batchSize = 100;
    const totalUsers = 1000;

    for (let i = 0; i < totalUsers; i += batchSize) {
      const usersBatch = Array.from({ length: batchSize }, () => ({
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
      }));

      // Save the batch of users
      await userRepository.save(usersBatch);
    }

    return { message: '1000 Users populated successfully!' };
  }
}